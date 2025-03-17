import { createSignal, createEffect, onCleanup } from 'solid-js';

// Sample store for demonstration
const useStore = () => {
  const [count, setCount] = createSignal(0);
  
  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() - 1);

  return { count, increment, decrement };
};

// Console component
const Console = ({ stores }) => {
  const [command, setCommand] = createSignal('');
  const [output, setOutput] = createSignal([]);
  const [history, setHistory] = createSignal([]);

  const executeCommand = () => {
    const cmd = command().trim();
    if (!cmd) return;
    
    // Add to history
    setHistory((prevHistory) => [...prevHistory, cmd]);

    // Try to execute the command
    try {
      const result = evalCommand(cmd);
      setOutput((prevOutput) => [...prevOutput, `> ${cmd}`, result]);
    } catch (error) {
      setOutput((prevOutput) => [...prevOutput, `> ${cmd}`, `Error: ${error.message}`]);
    }

    // Clear the input field after command execution
    setCommand('');
  };

  const evalCommand = (cmd) => {
    const [funcName, ...args] = cmd.split(' ');

    // Execute based on the command name
    if (funcName === 'get') {
      const store = args[0];
      if (stores[store]) {
        return stores[store]();
      }
      return `No store named "${store}" found.`;
    } else if (funcName === 'set') {
      const store = args[0];
      const value = args.slice(1).join(' ');

      if (stores[store] && typeof stores[store].set === 'function') {
        stores[store].set(value);
        return `Set ${store} to ${value}`;
      }
      return `No set function available for ${store}.`;
    } else if (funcName === 'increment' || funcName === 'decrement') {
      const store = args[0];
      if (stores[store] && typeof stores[store][funcName] === 'function') {
        stores[store][funcName]();
        return `${store} ${funcName}ed`;
      }
      return `${store} does not have an "${funcName}" function.`;
    }

    return `Unknown command: ${cmd}`;
  };

  return (
    <div class="console">
      <div class="console-output">
        {output().map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div class="console-input">
        <input
          type="text"
          value={command()}
          onInput={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          placeholder="Type a command..."
        />
      </div>
      <div class="console-history">
        <h4>Command History</h4>
        <ul>
          {history().map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Sample usage with stores and context
const App = () => {
  const store = useStore();
  
  return (
    <div>
      <h1>Interactive Console Example</h1>
      <Console stores={{ counter: store }} />
    </div>
  );
};

export default App;
