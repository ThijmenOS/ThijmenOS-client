const template = `
  <div class="authorization-form-container">
    <div class="profile-image">
      <img
        class="user-profile-picture"
        src="http://localhost:8080/static/C/OperatingSystem/Icons/default_profile_picture.svg"
      />
      <p class="authorization-form-username"></p>
      <p class="authorization-failed">Incorrect credentials</p>
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
        id="password"
        class="authorization-password-field"
        name="password"
        placeholder="password"
      />
      <p class="authentication-method-selector">Sigin in with pincode</p>
      <input type="submit" value="signin" />
    </form>
  </div>
 `;

export default template;
