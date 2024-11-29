document.getElementById('compileButton').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const langId = document.getElementById('languageSelect').value;

    document.getElementById('consoleOutput').textContent = 'Compiling...';

    if (!code) {
        document.getElementById('consoleOutput').textContent = 'Error: Code is empty!';
        return;
    }

   
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://codequotient.com/api/executeCode', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.error) {
                document.getElementById('consoleOutput').textContent = `Error: ${response.error}`;
            } else if (response.codeId) {
                // Start fetching results after a delay
                document.getElementById('consoleOutput').textContent = 'Code submitted successfully, fetching result...';
                let codeId = response.codeId;

                let interval = setInterval(function() {
                    fetchResult(codeId, interval);
                }, 5000); // Check for result every 5 seconds
            }
        }
    };

    // Prepare the data and send the POST request
    const data = JSON.stringify({ code: code, langId: langId });
    xhr.send(data);
});

// Fetch result using codeId with XMLHttpRequest
function fetchResult(codeId, interval) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://codequotient.com/api/codeResult/${codeId}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            if (data.data && data.data.output) {
                clearInterval(interval);
                document.getElementById('consoleOutput').textContent = `Output: \n${data.data.output}`;
            } else if (data.data && data.data.errors) {
                clearInterval(interval);
                document.getElementById('consoleOutput').textContent = `Errors: \n${data.data.errors}`;
            } else {
                // No result yet, continue polling
                console.log('Waiting for result...');
            }
        }
    };

    xhr.send();
}
