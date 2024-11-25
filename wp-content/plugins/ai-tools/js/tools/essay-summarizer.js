export function renderTool(toolContent, baseUrl) {
    toolContent.innerHTML = `
        <div class="p-4 border rounded">
            <h3>Essay Summarizer</h3>
            <textarea 
                id="summary-input" 
                class="form-control mb-3" 
                rows="5" 
                placeholder="Enter text to summarize..."
            ></textarea>
            <button 
                id="summarize-btn" 
                class="btn btn-primary"
            >
                Summarize
            </button>
            <div id="summary-container" class="mt-3"></div>
        </div>
    `;

    const summarizeBtn = document.getElementById('summarize-btn');
    const summaryInput = document.getElementById('summary-input');
    const summaryContainer = document.getElementById('summary-container');

    summarizeBtn.addEventListener('click', async () => {
        const text = summaryInput.value.trim();
        if (!text) {
            alert('Please enter text to summarize.');
            return;
        }

        summarizeBtn.textContent = 'Processing...';
        summarizeBtn.disabled = true;

        try {
            const response = await fetch(`${baseUrl}/essay-summarizer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch summary');
            }

            const data = await response.json();
            summaryContainer.innerHTML = `
                <p><strong>Summary:</strong></p>
                <p>${data.summary}</p>
            `;
        } catch (error) {
            summaryContainer.innerHTML = `
                <p style="color:red;">Error: ${error.message}</p>
            `;
        } finally {
            summarizeBtn.textContent = 'Summarize';
            summarizeBtn.disabled = false;
        }
    });
}