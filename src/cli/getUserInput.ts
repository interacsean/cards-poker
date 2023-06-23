const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Generator function that yields user input
function* userInputGenerator() {
  while (true) {
    const prompt = yield;

    yield new Promise((resolve) => {
      rl.question(prompt, (input) => {
        resolve(input);
      });
    });
  }
}

// Function to read user input
export function getUserInput(prompt: string) {
  const generator = userInputGenerator();
  generator.next(); // Start the generator

  return new Promise<string>((resolve, reject) => {
    function processInput() {
      const inputPromise = generator.next(prompt).value;

      if (inputPromise instanceof Promise) {
        inputPromise
          .then((input: string) => {
            if (input.toLowerCase() === "exit") {
              console.log("Exiting...");
              rl.close();
              resolve(input); // Resolve the promise with the "exit" input
            } else {
              resolve(input); // Resolve the promise with the user input
              processInput(); // Ask for the next input
            }
          })
          .catch((error) => {
            reject(error); // Reject the promise on error
          });
      }
    }

    processInput();
  });
}
