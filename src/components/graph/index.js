// Constants
const NODE_SIZE = 5
const LINK_TEXT_COLOR = 'yellow'
const LINK_PARTICLE_MULTIPLE = 0.001
const MAX_FONT_SIZE = 4
const NODE_PADDING = 0.2
const LABEL_NODE_MARGIN = 1.5
let MAX_GROUP = 0
let rootNode

const selectedNodes = new Set()

/**
 *
 * @param {*} nodes 
 * @returns 
 */
function getMaxGroup (nodes, links) {
  const values = {}
  let result = 0

  for (const link of links) {
    if (values[link.source] === undefined) {
      values[link.source] = 0
    }

    if (values[link.target] === undefined) {
      values[link.target] = 0
    }

    values[link.source] += 1
    values[link.target] += 1
  }

  for (const nodeId of Object.keys(values)) {
    const index = nodes.findIndex(node => node.id === nodeId)
    
    nodes[index].group = values[nodeId]

    if (values[nodeId] > result) {
      result = values[nodeId]
    }
  }

  return result
}

/**
 *
 * @param {*} value
 * @returns
 */
function getFontColor(value) {
  if (value === 1) {
    return `#FF0000`
  }

  const offset = Math.floor(255 * (1 - value))
  const hex = offset.toString(16).padStart(2, '0')
  return `#FFFF${hex}`
}

/**
 * My god, this tutorial code is abusively bad
 */
function startGraph () {
  const Graph = ForceGraph({
    // extraRenderers: [new CSS2DRenderer()]
  })(document.getElementById('graph'))

  Graph
    //.cooldownTicks(0)
    .backgroundColor('#000000')

    // JSON property to use to determine node groupings
    .nodeAutoColorBy('group')

    // Set the node relative size
    .nodeRelSize(NODE_SIZE)
    
    // Set the CSS color to use for each node
    //.nodeColor(NODE_COLORS)

    // Populate node labels with HTML
    .nodeCanvasObject((node, ctx, globalScale) => {
      const label = node.id

      const fontSize = label === rootNode.id
        ? 14
        : ((node.group / MAX_GROUP) * 7) + 7

      const textWidth = ctx.measureText(label).width
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * NODE_PADDING)

      ctx.font = `${fontSize}px Sans-Serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
      ctx.fillStyle = label === rootNode.id
        ? 'green'
        : getFontColor((fontSize - 7) / 7)
      ctx.fillText(label, node.x, node.y)

      // to re-use in nodePointerAreaPaint
      node.__bckgDimensions = bckgDimensions
    })
    .nodePointerAreaPaint((node, color, ctx) => {
      ctx.fillStyle = color
      const bckgDimensions = node.__bckgDimensions
      bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
    })

    // Populate links with HTML
    .linkCanvasObjectMode(() => 'after')
    .linkCanvasObject((link, ctx) => {
      const start = link.source
      const end = link.target
      const label = link.description

      // ignore unbound links
      if (label === ' ' || typeof start !== 'object' || typeof end !== 'object') {
        return
      }

      // calculate label positioning
      const textPos = Object.assign(...['x', 'y'].map(c => ({
        // calc middle point
        [c]: start[c] + (end[c] - start[c]) / 2
      })))

      const relLink = { x: end.x - start.x, y: end.y - start.y }

      const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - Graph.nodeRelSize() * LABEL_NODE_MARGIN * 2

      
      // maintain label vertical orientation for legibility
      let textAngle = Math.atan2(relLink.y, relLink.x);
      if (textAngle > Math.PI / 2) {
        textAngle = -(Math.PI - textAngle)
      }

      if (textAngle < -Math.PI / 2) {
        textAngle = -(-Math.PI - textAngle)
      }

      // estimate fontSize to fit in link length
      ctx.font = '1px Sans-Serif'
      const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width)

      ctx.font = `${fontSize}px Sans-Serif`
      const textWidth = ctx.measureText(label).width
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * NODE_PADDING)

      // draw text label (with background rect)
      ctx.save()
      ctx.translate(textPos.x, textPos.y)
      ctx.rotate(textAngle)

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, ...bckgDimensions)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = LINK_TEXT_COLOR
      ctx.fillText(label, 0, 0)
      ctx.restore()
    })
    .linkColor(() => '#ffffff')
    .linkWidth(2)

    // Focus on node upon click
    .linkDirectionalParticles(2)
    .linkDirectionalParticleWidth(1.4)
    .onNodeClick(node => {
      // Center/zoom on node
      Graph.centerAt(node.x, node.y, 1000);
      Graph.zoom(8, 2000);
      console.log(node.group /MAX_GROUP, node)
    })

    // Link particles
    .linkDirectionalArrowLength(6)
    .linkDirectionalArrowColor(() => LINK_TEXT_COLOR)
    .linkDirectionalParticles("value")
    .linkDirectionalArrowRelPos(1)
    .linkDirectionalParticleSpeed(d => d.value * LINK_PARTICLE_MULTIPLE)

  return Graph
}

/**
 *
 */
window.addEventListener('load', function() {
  const Graph = startGraph()
  const { nodes, links } = Graph.graphData()
  
  /**
   * 
   */
  function sendMessage(message) {
    window.parent.postMessage(JSON.stringify(message), '*')
  }

  /**
   *
   */
  window.addEventListener('message', function(event) {
    // Ensure the message is from the parent window
    if (event.source === window.parent) {
        const graphMessage = JSON.parse(event.data)
        const { nodes, links } = Graph.graphData()
        const newNodes = (graphMessage.nodes || [])
        const newLinks = (graphMessage.links || [])

        switch(graphMessage.action) {
          case 'populate':
            MAX_GROUP = getMaxGroup(newNodes, newLinks)
            rootNode = newNodes[0]
            Graph.graphData({
              nodes: newNodes,
              links: newLinks
            })

            this.setTimeout(() => {
              Graph.centerAt(rootNode.x, rootNode.y, 500)
              Graph.zoom(1, 500)
            }, 2000)
            
            break

          case 'reset':
            MAX_GROUP = 0
            rootNode = undefined
            Graph.graphData({
              nodes: [],
              links: []
            })
            break

          case 'add':
            const mergedNodes = [...nodes, ...newNodes]
            const mergedLinks = [...links, ...newLinks]
            MAX_GROUP = getMaxGroup(mergedNodes, mergedLinks)
            rootNode = newNodes[0]

            Graph.graphData({
              nodes: mergedNodes,
              links: mergedLinks
            })
            
            this.setTimeout(() => {
              Graph.centerAt(rootNode.x, rootNode.y, 500)
            }, 2000)

            break

          case 'select':

            break

          case 'complete':

            break
        }
        sendMessage({
          spaceId: graphMessage.spaceId,
          action: 'complete',
          id: graphMessage.id
        })
    }
  })  
})
