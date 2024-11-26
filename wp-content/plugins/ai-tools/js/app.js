// Tool modules configuration
const tools = {
    'essay-extender': {
        label: 'Essay Extender',
        module: './tools/essay-extender.js'
    },
};

function renderSidebar() {
    const sidebarContainer = document.getElementById('ai-tools-sidebar');
    
    sidebarContainer.innerHTML = `
       <div class="sidebar">
        <h4 class="sidebar-title">
            <i class="fas fa-robot"></i>
            AI Tools
        </h4>
        <nav class="sidebar-nav">
        ${Object.entries(tools).map(([toolId, tool]) => `
            <button 
                id="${toolId}-btn" 
                class="sidebar-link" 
                data-tool="${toolId}" 
            >
                ${tool.label}
            </button>
        `).join('')}
        </nav>
        </div>
    `;

    // Add event listeners to tool buttons
    Object.keys(tools).forEach(toolId => {
        const button = document.getElementById(`${toolId}-btn`);
        button.addEventListener('click', () => loadTool(toolId));
    });
}

// Helper function to get icons for tools
function getToolIcon(toolId) {
    const icons = {
        'essay-extender': 'fa-file-alt',
        // Add more tool icons as needed
        'default': 'fa-tools'
    };
    return icons[toolId] || icons['default'];
}

// Load and render a specific tool
async function loadTool(toolId) {
    const toolContent = document.getElementById('tool-content');
    const tool = tools[toolId];

    // Remove active state from all buttons
    document.querySelectorAll('#ai-tools-sidebar .list-group-item-action').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active state to selected tool button
    const activeButton = document.getElementById(`${toolId}-btn`);
    activeButton.classList.add('active');

    try {
        // Dynamically import the tool module
        const toolModule = await import(tool.module);
        
        // Clear previous tool content
        toolContent.innerHTML = '';
        
        // Render the specific tool
        toolModule.renderTool(
            toolContent, 
            aiToolsConfig.baseUrl
        );
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
document.addEventListener('DOMContentLoaded', () => {
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