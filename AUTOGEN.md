# Specification Proposal

* Validation library
* Layout generator
* Endpoint generator
* Error mapping
* Code generator
* Template handler
  * primitive
    * type
    * string
    * number
    * regexp
    * null
    * array
    * object
  * {store}
  * {values}
  * {persist}
  * {endpoints}
  * {dot pathing}


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
        required: true # Must be populated

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

Useful for when you have to update a Concept

```ts
import { createSignal } from "solid-js";

// Example StoreConnector that handles the user state logic
function StoreConnector({ children }) {
  const [user, setUser] = createSignal([{ name: "John Doe" }]); // Example state

  const getUserName = (index) => user()[index]?.name || "";

  // Passing down a method to abstract state access
  return children({ getUserName });
}

function UserComponent() {
  return (
    <StoreConnector>
      {({ getUserName }) => (
        <div>
          <p>User Name: {getUserName(0)}</p>
        </div>
      )}
    </StoreConnector>
  );
}

export default UserComponent;
```
