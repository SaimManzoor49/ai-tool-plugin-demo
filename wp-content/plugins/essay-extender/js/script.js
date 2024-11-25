// // script.js
jQuery(document).ready(function($) {
    // Generate Table of Contents
    function generateTOC() {
        const headings = $('.essay-content h2');
        const tocList = $('#toc-list');
        
        // Clear existing TOC
        tocList.empty();
        
        if (headings.length === 0) {
            tocList.append('<li>No sections available</li>');
            return;
        }
        
        headings.each(function(index) {
            const headingText = $(this).text();
            const headingId = `section-${index}`;
            $(this).attr('id', headingId);
            
            tocList.append(`
                <li>
                    <a href="#${headingId}" class="toc-link">
                        ${index + 1}. ${headingText}
                    </a>
                </li>
            `);
        });

        // Add click handlers for smooth scrolling
        $('.toc-link').on('click', function(e) {
            e.preventDefault();
            const targetId = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(targetId).offset().top - 50
            }, 500);
        });
    }

    // Word count function
    function getWordCount(text) {
        return text.trim().split(/\s+/).length;
    }

    // Handle essay extension
    $('#extend-essay').on('click', function() {
        const essayText = $('#essay-input').val();
        const outputDiv = $('#extended-output');
        const wordCount = getWordCount(essayText);

        // Validate input
        if (!essayText) {
            alert('Please enter some text to extend.');
            return;
        }

        if (wordCount < 50) {
            alert('Please enter at least 50 words for better results.');
            return;
        }

        // Show loading state
        $(this).prop('disabled', true).text('Processing...');
        outputDiv.html(`
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Extending your essay... (${wordCount} words)</p>
            </div>
        `);

        // Make AJAX request
        $.ajax({
            url: essayExtenderAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'extend_essay',
                nonce: essayExtenderAjax.nonce,
                essay: essayText
            },
            success: function(response) {
                if (response.success && response.data.extended_text) {
                    const extendedWordCount = getWordCount(response.data.extended_text);
                    outputDiv.html(`
                        <div class="success-message">
                            <p>✓ Essay successfully extended!</p>
                            <p>Original: ${wordCount} words → Extended: ${extendedWordCount} words</p>
                        </div>
                        <div class="extended-content">
                            <h3>Extended Version:</h3>
                            <div class="extended-text">${response.data.extended_text}</div>
                            <div class="action-buttons">
                                <button class="copy-button">Copy to Clipboard</button>
                                <button class="download-button">Download as TXT</button>
                            </div>
                        </div>
                    `);

                    // Add copy to clipboard functionality
                    $('.copy-button').on('click', function() {
                        const textToCopy = $('.extended-text').text();
                        navigator.clipboard.writeText(textToCopy).then(function() {
                            $(this).text('Copied!');
                            setTimeout(() => $(this).text('Copy to Clipboard'), 2000);
                        }.bind(this));
                    });

                    // Add download functionality
                    $('.download-button').on('click', function() {
                        const text = $('.extended-text').text();
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'extended-essay.txt';
                        a.click();
                        window.URL.revokeObjectURL(url);
                    });

                } else {
                    const errorMessage = response.data.message || 'An error occurred while extending the essay.';
                    outputDiv.html(`
                        <div class="error-message">
                            <p>❌ Error: ${errorMessage}</p>
                            ${response.data.debug ? 
                                `<details>
                                    <summary>Technical Details</summary>
                                    <pre>${JSON.stringify(response.data.debug, null, 2)}</pre>
                                </details>` 
                                : ''
                            }
                        </div>
                    `);
                }
            },
            error: function(xhr, status, error) {
                outputDiv.html(`
                    <div class="error-message">
                        <p>❌ Server Error: ${error}</p>
                        <details>
                            <summary>Technical Details</summary>
                            <p>Status: ${status}</p>
                            <pre>${xhr.responseText || 'No response details available'}</pre>
                        </details>
                    </div>
                `);
            },
            complete: function() {
                $('#extend-essay').prop('disabled', false).text('Extend Essay');
            },
            timeout: 60000 // 60 second timeout
        });
    });

    // Add character counter to textarea
    $('#essay-input').on('input', function() {
        const wordCount = getWordCount($(this).val());
        const charCount = $(this).val().length;
        
        // Update or create counter element
        if ($('#text-counter').length === 0) {
            $(this).after(`<div id="text-counter"></div>`);
        }
        
        $('#text-counter').html(`
            <span>${wordCount} words</span> | 
            <span>${charCount} characters</span>
        `);
    });

    // Auto-save functionality
    let autoSaveTimer;
    $('#essay-input').on('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            localStorage.setItem('savedEssay', $(this).val());
            if ($('#auto-save-notice').length === 0) {
                $(this).after('<div id="auto-save-notice">Draft saved</div>');
                setTimeout(() => $('#auto-save-notice').fadeOut(), 2000);
            }
        }, 1000);
    });

    // Load saved draft if exists
    const savedEssay = localStorage.getItem('savedEssay');
    if (savedEssay) {
        $('#essay-input').val(savedEssay);
        $('#essay-input').trigger('input'); // Update counter
    }

    // Clear draft button
if ($('#clear-draft').length === 0) {
    $('#essay-input').after('<button id="clear-draft">Clear Draft</button>');
    
    // Apply minimum height
    $('#clear-draft').css('max-height', '50px');
}
    
    $('#clear-draft').on('click', function() {
        if (confirm('Are you sure you want to clear the draft?')) {
            localStorage.removeItem('savedEssay');
            $('#essay-input').val('').trigger('input');
        }
    });

    // Handle window resize for responsive TOC
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if ($(window).width() < 768) {
                $('.toc-container').addClass('collapsed');
            } else {
                $('.toc-container').removeClass('collapsed');
            }
        }, 250);
    });

    // Initialize
    generateTOC();
    $('#essay-input').trigger('input'); // Initialize counter
    $(window).trigger('resize'); // Initialize responsive behavior
});

jQuery(document).ready(function($) {
    const essayInput = $('#essay-input');
    const extendButton = $('#extend-essay');
    const outputDiv = $('#extended-output');
    const textCounter = $('#text-counter');
    
    // Update word count
    function updateWordCount() {
        const wordCount = essayInput.val().trim().split(/\s+/).filter(Boolean).length;
        textCounter.text(`Word count: ${wordCount}`);
        
        if (wordCount < 10) {
            extendButton.prop('disabled', true);
            textCounter.addClass('error-message');
        } else {
            extendButton.prop('disabled', false);
            textCounter.removeClass('error-message');
        }
    }
    
    essayInput.on('input', updateWordCount);
    
    extendButton.on('click', function() {
        const essay = essayInput.val().trim();
        
        if (!essay) {
            showError('Please enter some text to extend.');
            return;
        }
        
        
        // Show loading state
        extendButton.addClass('loading');
        extendButton.prop('disabled', true);
        outputDiv.hide();
        
        // Make AJAX request
        $.ajax({
            url: essayExtenderAjax.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'extend_essay',
                nonce: essayExtenderAjax.nonce,
                essay: essay
            },
            success: function(response) {
                console.log('API Response:', response);
                
                if (response.success && response.data.extended_text) {
                    outputDiv
                        .html(response.data.extended_text)
                        .show();
                } else {
                    showError(response.data.message || 'An error occurred while extending the essay.');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error Details:', {
                    status: status,
                    error: error,
                    responseText: xhr.responseText
                });
                
                try {
                    const response = JSON.parse(xhr.responseText);
                    showError(response.data.message || 'An error occurred while processing your request.');
                } catch (e) {
                    showError('A server error occurred. Please try again later.');
                }
            },
            complete: function() {
                extendButton.removeClass('loading');
                extendButton.prop('disabled', false);
            }
        });
    });
    
    // Helper function to show errors
    function showError(message) {
        outputDiv
            .html(`<div class="error-message">${message}</div>`)
            .show();
        console.error('Essay Extender Error:', message);
    }
    
    // Initialize word count
    updateWordCount();
});



jQuery(document).ready(function($) {
    $('#extend-essay-btn').on('click', function() {
        const essayText = $('#essay-input').val();
        
        if (!essayText) {
            alert('Please enter some text to extend');
            return;
        }
        
        $(this).prop('disabled', true).text('Processing...');
        
        $.ajax({
            url: essayExtenderAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'extend_essay',
                nonce: essayExtenderAjax.nonce,
                essay: essayText
            },
            success: function(response) {
                if (response.success) {
                    $('#essay-output')
                        .html(response.data.extended_text)
                        .removeClass('hidden');
                } else {
                    alert('Error: ' + response.data.message);
                }
            },
            error: function() {
                alert('An error occurred while processing your request');
            },
            complete: function() {
                $('#extend-essay-btn')
                    .prop('disabled', false)
                    .text('Extend Essay');
            }
        });
    });
});