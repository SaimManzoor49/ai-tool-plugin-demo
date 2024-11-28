(function ($) {
  $(document).ready(function () {
    // Check if aiToolsConfig exists and has primary color
    if (aiToolsConfig && aiToolsConfig.primaryColor) {
      // Set primary color variables and styles
      $(":root").css("--primary-color", aiToolsConfig.primaryColor);
      $(".primary").css("color", aiToolsConfig.primaryColor);
      $(".primary-bg").css("background-color", aiToolsConfig.primaryColor);
    }
    // Check if aiToolsConfig exists and has secondary color
    if (aiToolsConfig && aiToolsConfig.secondaryColor) {
      // Set secondary color variables and styles
      $(":root").css("--secondary-color", aiToolsConfig.secondaryColor);
      $(".secondary").css("color", aiToolsConfig.secondaryColor);
      $(".secondary-bg").css("background-color", aiToolsConfig.secondaryColor);
    }

    // Add custom dropdown styles
    const styleContent = `
      .custom-tone-dropdown .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
      }
  
      .custom-tone-dropdown .dropdown-item:hover {
        background-color: #f8f9fa;
        color: ${aiToolsConfig.primaryColor};
      }
  
      .custom-tone-dropdown .dropdown-item.active,
      .custom-tone-dropdown .dropdown-item.active:hover {
        background-color: ${aiToolsConfig.primaryColor};
        color: white;
        font-weight: bold;
      }
  
      .custom-tone-dropdown .dropdown-item.active::before {
        color: white;
      }`;

    // Create and append style tag
    const styleTag = document.createElement("style");
    styleTag.textContent = styleContent;
    document.head.appendChild(styleTag);
  });
})(jQuery);

// Tool modules configuration
const tools = {
  "text-humanizer": {
    label: "Text Humanizer",
    module: "./tools/text-humanizer.js",
  },
  "text-normalize": {
    label: "Text Humanizer",
    module: "./tools/text-humanizer.js",
  },
  "text-intergration": {
    label: "Text Humanizer",
    module: "./tools/text-humanizer.js",
  },
};

function renderSidebar() {
  const sidebarContainer = document.getElementById("ai-tools-sidebar");

  sidebarContainer.innerHTML = `
  <div class="sidebar secondary-bg rounded-3">
    <div class="sidebar-header">
      <div class="sidebar-title">AI TOOLS</div>
    </div>
    <nav class="sidebar-nav">
      <ul class="sidebar-menu">
        ${Object.entries(tools)
          .map(
            ([toolId, tool]) => `
            <li>
              <a href="#" id="${toolId}-btn" class="sidebar-link"  data-tool="${toolId}">
                ${tool.label}
              </a>
            </li>
        `
          )
          .join("")}
      </ul>
    </nav>
  </div>
  `;

  // Add event listeners to tool buttons
  Object.keys(tools).forEach((toolId) => {
    const button = document.getElementById(`${toolId}-btn`);
    button.addEventListener("click", (e) => {
      e.preventDefault();
      // Remove active class from all links
      document.querySelectorAll(".sidebar-menu a").forEach((link) => {
        link.classList.remove("active");
      });
      // Add active class to clicked link
      e.currentTarget.classList.add("active");

      // Load the tool
      loadTool(toolId);

      // Close sidebar on mobile
      if (window.innerWidth <= 992) {
        toggleSidebar();
      }
    });
  });
}

// Helper function to get icons for tools
function getToolIcon(toolId) {
  const icons = {
    "text-humanizer": "fa-file-alt",
    // Add more tool icons as needed
    default: "fa-tools",
  };
  return icons[toolId] || icons["default"];
}

// Load and render a specific tool
async function loadTool(toolId) {
  const toolContent = document.getElementById("tool-content");
  const tool = tools[toolId];

  // Remove active state from all buttons
  document
    .querySelectorAll("#ai-tools-sidebar .list-group-item-action")
    .forEach((btn) => {
      btn.classList.remove("active");
    });

  // Add active state to selected tool button
  const activeButton = document.getElementById(`${toolId}-btn`);
  activeButton.classList.add("active");

  try {
    // Dynamically import the tool module
    const toolModule = await import(tool.module);

    // Clear previous tool content
    toolContent.innerHTML = "";

    // Render the specific tool
    toolModule.renderTool(toolContent, aiToolsConfig.baseUrl);
  } catch (error) {
    console.error(`Failed to load tool ${toolId}:`, error);
    toolContent.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> Failed to load ${tool.label} tool. 
                Please try again later.
            </div>
        `;
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Render the sidebar
  renderSidebar();

  // Load the first tool by default
  const firstToolId = Object.keys(tools)[0];
  if (firstToolId) {
    loadTool(firstToolId);
  }
});

// Optional: Expose loadTool function globally if needed
window.loadAITool = loadTool;
