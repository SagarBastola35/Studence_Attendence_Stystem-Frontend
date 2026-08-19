import axios from "axios";

export const checkServerStatus = async () => {
  try {
    const response = await axios.get("/api/health", { timeout: 5000 });
    if (response.status === 200) {
      console.log("Backend server is running");
      return true;
    }
  } catch (error) {
    console.error("Backend server is not running:", error.message);
    return false;
  }
  return false;
};

export const showServerError = () => {
  const errorDiv = document.createElement("div");
  errorDiv.style.position = "fixed";
  errorDiv.style.top = "0";
  errorDiv.style.left = "0";
  errorDiv.style.right = "0";
  errorDiv.style.backgroundColor = "#ef4444";
  errorDiv.style.color = "white";
  errorDiv.style.padding = "10px";
  errorDiv.style.textAlign = "center";
  errorDiv.style.zIndex = "9999";
  errorDiv.style.fontFamily = "monospace";
  errorDiv.innerHTML = `
    <strong>Backend Server Not Running</strong><br>
    Please start the backend server with: <code style="background: rgba(0,0,0,0.2); padding: 2px 5px; border-radius: 3px;">cd backend && npm run dev</code>
  `;
  document.body.prepend(errorDiv);
};
