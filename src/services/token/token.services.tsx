const Token = () => {
  // userSettings();
  if (!localStorage.getItem("token_app")) {
    localStorage.setItem("token_app", "");
    return "";
  }
  return localStorage.getItem("token_app");
};


export { Token };
