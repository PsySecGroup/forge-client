import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

/**
 * 
 */
export async function modifyFile(filePath: string, searchTexts: string[], newLine: string): Promise<void> {
	// Read the file content
	const fileContent = await readFile(filePath, 'utf-8')

	// Split the content into lines
	const lines = fileContent.split('\n')

	// Flag to mark if the text is found and line added
	let textFound = false

	// Loop through each line to find the first occurrence of any search text
	for (let i = 0; i < lines.length; i++) {
		for (const searchText of searchTexts) {
			if (!textFound && lines[i].includes(searchText)) {
				// Insert the new line right after the found line
				lines.splice(i + 1, 0, newLine);
				textFound = true
				break
			}
		}

		if (textFound) break  // Exit loop after first match
	}

	if (textFound) {
		// Join the lines back into a single string
		const updatedContent = lines.join('\n')

		// Write the updated content back to the file
		await writeFile(filePath, updatedContent, 'utf-8')

		return true
	} else {
		return false
	}
}

/**
 *
 */
export function toCamelCaseVariants(str) {
  const lowerCase = str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
  
  const upperCase = lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1)

  return {
    lowerCase,    // First character lowercase
    upperCase    // First character uppercase
  }
}
