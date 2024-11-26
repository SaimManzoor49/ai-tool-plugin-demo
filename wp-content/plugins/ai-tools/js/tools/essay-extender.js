export function renderTool(toolContent, baseUrl) {
    toolContent.innerHTML = `
        <div class="text-humanizeer-container">
            <div class="row">
                <div class="col-12">
                    <h3 class="tool-title mb-4">
                        <i class="fas fa-magic"></i> Text Humanizer
                        <small class="text-muted d-block mt-2">Enhance and Expand Your Writing</small>
                    </h3>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12 col-md-6 mb-3">
                    <div class="input-section">
                        <label for="text-input" class="form-label">
                            <i class="fas fa-edit"></i> Original text
                        </label>
                        <textarea 
                            id="text-input" 
                            class="form-control text-textarea" 
                            rows="10" 
                            placeholder="Paste your original text here..."
                        ></textarea>
                        <div class="text-count mt-2">
                            <span id="input-word-count">0 words</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-12 col-md-6 mb-3">
                    <div class="output-section">
                        <label for="humanizeed-text" class="form-label">
                            <i class="fas fa-expand"></i> Humanized text
                        </label>
                        <textarea 
                            id="humanizeed-text" 
                            class="form-control text-textarea" 
                            rows="10" 
                            readonly 
                            placeholder="Humanized text will appear here..."
                        ></textarea>
                        <div class="text-count mt-2">
                            <span id="output-word-count">0 words</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <div class="action-buttons d-flex justify-content-between align-items-center">
                        <div class="humanize-options">
                        <label for="floatingSelectGrid">Tone:</label>
                            <select id="humanize-mode" class="form-select w-auto d-inline-block me-2">
                                <option value="standard" selected>Standard</option>
                                <option value="proffectional">Proffectional</option>
                                <option value="academic">Academic</option>
                                <option value="creative">Creative</option>
                                <option value="Blg/SEO">Blg/SEO</option>
                                <option value="Casual">Casual</option>
                                <option value="Casual">Casual</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>
                        <div class="processing-actions">
                            <button 
                                id="humanize-text-btn" 
                                class="btn btn-primary"
                            >
                                <i class="fas fa-expand-arrows-alt"></i> Humanize text
                            </button>
                            <button 
                                id="copy-btn" 
                                class="btn btn-outline-secondary ms-2"
                                disabled
                            >
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="response-container" class="mt-3"></div>

            <!-- FAQ Section -->
            <div class="faq-section mt-5">
                <h4 class="faq-title">
                    <i class="fas fa-question-circle"></i> Frequently Asked Questions
                </h4>
                <div class="accordion" id="texthumanizeerFAQ">
                    ${generateFAQs().map((faq, index) => `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${index}">
                                <button 
                                    class="accordion-button ${index !== 0 ? 'collapsed' : ''}" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapse${index}" 
                                    aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                    aria-controls="collapse${index}"
                                >
                                    ${faq.question}
                                </button>
                            </h2>
                            <div 
                                id="collapse${index}" 
                                class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                                aria-labelledby="heading${index}" 
                                data-bs-parent="#texthumanizeerFAQ"
                            >
                                <div class="accordion-body">
                                    ${faq.answer}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    function generateFAQs() {
        return [
            {
                question: "How does the text humanizeer work?",
                answer: "Our AI-powered text humanizeer analyzes your original text and generates additional content that maintains the original tone, style, and context. It uses advanced natural language processing to create meaningful and coherent expansions."
            },
            {
                question: "Can the text humanizeer help with different types of texts?",
                answer: "Yes! The tool is designed to work with various text types, including academic, creative, narrative, and descriptive texts. You can choose different extension modes to suit your specific needs."
            },
            {
                question: "Is the generated content original?",
                answer: "The text humanizeer creates unique content based on your original text. While it draws inspiration from your writing, it generates new sentences and paragraphs to expand your text authentically."
            },
            {
                question: "How long can the text be humanizeed?",
                answer: "The tool can typically humanize your text by 30-50% of its original length. The exact expansion depends on the complexity of your original text and the selected extension mode."
            },
            {
                question: "Is my text content secure?",
                answer: "Absolutely. We prioritize your privacy and do not store or share your text content. All processing is done securely and confidentially."
            }
        ];
    }
    // Enhanced JavaScript for interactivity
    const humanizetextBtn = document.getElementById('humanize-text-btn');
    const copyBtn = document.getElementById('copy-btn');
    const textInput = document.getElementById('text-input');
    const humanized = document.getElementById('humanizeed-text');
    const inputWordCount = document.getElementById('input-word-count');
    const outputWordCount = document.getElementById('output-word-count');
    const humanizeMode = document.getElementById('humanize-mode');
    const responseContainer = document.getElementById('response-container');

    // Word count function
    function updateWordCount(textarea, countElement) {
        const text = textarea?.value?.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        countElement.textContent = `${wordCount} words`;
    }

    // Add event listeners for word count
    textInput.addEventListener('input', () => updateWordCount(textInput, inputWordCount));
    humanized.addEventListener('input', () => updateWordCount(humanized, outputWordCount));

    // Copy functionality
    copyBtn.addEventListener('click', () => {
        humanized.select();
        document.execCommand('copy');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });

    // humanize text functionality
    humanizetextBtn.addEventListener('click', async () => {
        console.log(textInput)
        const textText = textInput?.value?.trim();
        if (!textText) {
            alert('Please enter an text.');
            return;
        }

        humanizetextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        humanizetextBtn.disabled = true;
        copyBtn.disabled = true;
        try {
            const response = await fetch(`${baseUrl}/humanizer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    text: textText,
                    tone: humanizeMode.value 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            humanized.value = data?.response?.content;
            updateWordCount(humanized, outputWordCount);
            copyBtn.disabled = false;

            responseContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle"></i> text successfully humanizeed!
                </div>
            `;
        } catch (error) {
            responseContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> Error: ${error.message}
                </div>
            `;
        } finally {
            humanizetextBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> humanize text';
            humanizetextBtn.disabled = false;
        }
    });
}