const Token = () => {
  // userSettings();
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "");
    return "";
  }
  return localStorage.getItem("token");
};

export { Token };
