const template = (profilePicture: string) =>
  `
  <div id="authorization-form-container" class="authorization-form-container">
    <div id="profile-image" class="profile-image">
      <img
        id="user-profile-picture"
        class="user-profile-picture"
        src="${profilePicture}"
      />
      <p id="authorization-form-username" class="authorization-form-username"></p>
      <p id="authorization-failed" class="authorization-failed">Incorrect credentials</p>
    </div>
    <form id="authorization-form" class="authorization-form">
      <input
        type="text"
        id="username"
        class="authorization-username-field"
        name="username"
        placeholder="username"
      />
      <input
        type="password"
        class="authorization-password-field"
        name="password"
        placeholder="password"
      />
      <p id="authentication-method-selector" class="authentication-method-selector">Sign in with pincode</p>
      <input id="submit" type="submit" value="signin" />
    </form>
  </div>
 `;

export default template;
