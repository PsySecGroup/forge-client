# Specification Proposal

Here's an idea for a schema

```yaml
schema:
  user:
    id:
      type: number
      validation: true # Ensures 'id' is a number
    name:
      type: string
      validation:
        min: 3 # Minimum length of 3 characters
        max: 10 # Maximum length of 10 characters
        match: /someRegex/ # Can also reference a function for validation
    profilePic:
      type: string
    email:
      type: string
      validation:
        match: /emailRegex/ # Ensures it's a valid email format
    role:
      type: string
      validation:
        values: ["admin", "user", "guest"] # Allowed values
    preferences:
      type: object
      validation: false
      default: {} # Stores user preferences (non-validated object)

  comments:
    id:
      type: number
      validation: true
    text:
      type: string
      default: "hello" # Default comment text
      validation:
        min: 3
        max: 100
        match: /[A-Za-z0-9]/ # Ensures comment text is alphanumeric
    createdAt:
      type: Date
      validation:
        max: now # Cannot be set to a future date
    userId:
      type: user # Reference to the 'user' type
      validation:
        null: false # Must be populated

pages:
  - name: "HomePage"
    layout: 
      top: 
        columns: 3
        sticky: top
        components:
          menu:
            type: Menu
            position: 1
            props:
              selectedItem: null
              greetings: "Hello {user[0].name}!"
          appLogo:
            type: Image
            position: 2
            props:
              src: "https://google.com/test.jpg"
          hamburger:
            type: Hamburger
            position: 3
            props:
              isOpen: {values.hamburger}
              clicked: {persist.clicked}
      form: # CSS Grid container for the form
        columns: 2
        components:
          nameInput:
            type: Input # This would be a text input component
            position: 1
            props:
              label: "Name"
              value: {user[0].name} # Bind to the first user's name from the user store
              onChange: {user[0].name} # Action to handle name change

          submitButton:
            type: Button
            position: 1
            newLine: true # if true, puts the submitButton below the nameInput.  If false, puts it next to it
            props:
              text: "Update Name"
              onClick: [endpoints.UpdateUser, user[0]] # A Batch action that will call the endpoint, then take the result and update the first user in the user Schema

  - name: "ProfilePage"
    layout:
      header:
        columns: 2
        components:
          profilePicture:
            type: Image
            position: 1
            props:
              src: {user[0].profilePic} # Binding to a user's profile picture
          editButton:
            type: Button
            position: 2
            props:
              text: "Edit Profile"
              onClick: {endpoint.UpdateUser} # Example of an action bound to a function

endpoints:
  FetchUser:
    method: "GET"
    url: "/api/user"
    description: "Fetch user data"
  
  UpdateUser:
    method: "POST"
    url: "/api/user/update"
    description: "Update user data"
    body:
      requiredFields:
        - name

  FetchComments:
    method: "GET"
    url: "/api/comments"
    description: "Fetch user comments"
  
  CreateComment:
    method: "POST"
    url: "/api/comment/create"
    description: "Create a new comment"
    body:
      requiredFields:
        - text
        - userId
```


# Insights

1. Tight Coupling of State and UI:
* Problem: The YAML configuration directly binds components to specific state slices, such as {user[0].name}. This creates a tight coupling between the state management and the UI layer.
* Impact: Refactoring state or changing data models later could result in cascading changes across multiple pages and components, as they all rely on explicit state bindings. It limits flexibility for future changes.
* Solution: You may want to add an abstraction layer, like a StoreConnector component, that decouples state logic from the UI components to ensure flexibility in refactoring.

2. Limited Logic Flexibility in YAML:
* Problem: YAML is a declarative format and doesn't easily support complex conditional logic or dynamic behavior.
* Impact: In more complex UI scenarios, where the form behavior depends on user actions (e.g., conditional rendering, showing/hiding elements), this YAML configuration might not be sufficient. You'll need to introduce custom logic inside the generated TSX files manually.
* Solution: Allow embedding custom logic in the YAML, such as using special syntax or hooks to handle more advanced scenarios.

3. Batch Actions Complexity:
* Problem: Using batch actions like [endpoints.UpdateUser, user[0]] is efficient, but it can introduce complexity in understanding the order of execution and handling potential errors.
* Impact: If the API call fails, the UI might still try to update the store, leading to inconsistencies or invalid states.
* Solution: You might need to introduce error handling in the batch action logic (e.g., preventing the state update unless the API call is successful). This could be difficult to model entirely in YAML, requiring additional handling in the generated TSX files.

4. State Synchronization:
* Problem: Automatically binding input values (e.g., {user[0].name}) to the state directly in onChange might lead to immediate state updates with every keystroke.
* Impact: This can cause performance issues, especially if many components update simultaneously or if frequent API calls are triggered as a result.
* Solution: Introduce debouncing or throttling mechanisms in the generated code, or batch updates to the state to reduce the performance load and excessive state re-renders.

5. Limited Validation Feedback:
* Problem: While validation can be defined declaratively (e.g., in validation: min: 3, max: 10), it's unclear how this feedback would be communicated back to the user in the UI (e.g., displaying error messages).
* Impact: Validation might only happen when submitting the form or through invisible side effects, without providing immediate feedback to the user during input.
* Solution: Extend the generated components to handle real-time validation feedback, showing error messages in the UI when the input is invalid.

6. Component Reusability:
* Problem: The YAML binds specific properties (like user[0].name) to the UI, which might reduce the reusability of components across different pages or sections of the app.
* Impact: If you need the same component on another page with a different state binding, you might end up duplicating components or writing custom code to handle that case.
* Solution: Implement a way to define reusable components and pass dynamic state bindings to them in the YAML configuration to avoid duplication.

7. Error Handling and API Failures:
* Problem: There's no mechanism defined for handling API errors or failures in the current YAML structure. For instance, what happens if endpoints.UpdateUser fails?
* Impact: If the API fails and there’s no error handling in the generated TSX, it could leave the UI in an inconsistent state, with unsaved changes and no feedback to the user.
* Solution: Incorporate error handling in the generated code, such as catching API errors and providing feedback to the user (e.g., error messages or rollback of state changes).

8. Scalability and Maintainability:
* Problem: As the app grows, managing state, validations, and endpoints in a single YAML file might become unwieldy, leading to large, complex configurations.
* Impact: It could be difficult to keep track of all bindings, rules, and endpoints, making debugging and extending the app more challenging.
* Solution: Break down the YAML file into smaller, modular parts, or generate multiple YAML files for different concerns (e.g., separate schemas for state, UI components, and endpoints).

9. Dynamic and Asynchronous Data:
* Problem: The current setup seems to assume synchronous state changes (e.g., immediate reflection in the store). If certain data comes from async sources (e.g., API calls), the UI might not behave as expected without explicit loading states.
* Impact: If user data is being fetched asynchronously, the form might render before the data is available, leading to errors or uninitialized states.
* Solution: Add support for async state management, such as showing loading indicators or placeholders while data is being fetched, and handle resolved data dynamically in the generated code.

10. Code Generation Complexity:
* Problem: Autogenerating SolidJS components based on YAML configuration requires sophisticated tooling, especially when handling nested logic like batch actions, validation, and error handling.
* Impact: If the code generation tool isn’t robust, it might introduce bugs or make it difficult to extend the generated code without breaking the core logic.
* Solution: Ensure the code generation process is thoroughly tested and can handle edge cases, and provide hooks or extension points for developers to add custom logic beyond the YAML configuration.