export function renderTool(toolContent, baseUrl) {
    toolContent.innerHTML = `
        <div class="p-4 border rounded">
            <h3>Essay Extender</h3>
            <textarea 
                id="essay-input" 
                class="form-control mb-3" 
                rows="5" 
                placeholder="Enter your essay..."
            ></textarea>
            <button 
                id="extend-essay-btn" 
                class="btn btn-success"
            >
                Extend Essay
            </button>
            <div id="response-container" class="mt-3"></div>
        </div>
    `;

    const extendEssayBtn = document.getElementById('extend-essay-btn');
    const essayInput = document.getElementById('essay-input');
    const responseContainer = document.getElementById('response-container');

    extendEssayBtn.addEventListener('click', async () => {
        const essayText = essayInput.value.trim();
        if (!essayText) {
            alert('Please enter an essay.');
            return;
        }

        extendEssayBtn.textContent = 'Processing...';
        extendEssayBtn.disabled = true;

        try {
            const response = await fetch(`${baseUrl}/essay-extender`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ essay: essayText }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            responseContainer.innerHTML = `
                <p><strong>Extended Essay:</strong></p>
                <p>${data.extendedEssay}</p>
            `;
        } catch (error) {
            responseContainer.innerHTML = `
                <p style="color:red;">Error: ${error.message}</p>
            `;
        } finally {
            extendEssayBtn.textContent = 'Extend Essay';
            extendEssayBtn.disabled = false;
        }
    });
}