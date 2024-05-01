

export const TokenButton = () => {
    const token = localStorage.getItem('token');

    const copyToken = () => {
        if (token) {
            // Create a temporary textarea element
            const textarea = document.createElement('textarea');

            // Set the value of the textarea to the token
            textarea.value = token;

            // Make sure the textarea is not visible
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';

            // Append the textarea to the document body
            document.body.appendChild(textarea);

            // Select the text within the textarea
            textarea.select();

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Remove the textarea from the document body
            document.body.removeChild(textarea);

            // Log to console or show an alert to indicate the token has been copied
            console.log('Token copied to clipboard: ', token);
        } else {
            // Token is not available in localStorage
            console.error('Token not found in localStorage');
        }

    }
  return (
    <>
    <button id="token-btn" onClick={copyToken}>Copy Bearer Token</button>
    </>
  )
}
