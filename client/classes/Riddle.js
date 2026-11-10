// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct
import PromptSync from 'prompt-sync';
const prompt = PromptSync();
class Riddle {
    constructor(id, name, taskDescription, correctAnswer, choices, level, timeLimit,hint) {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
        this.choices = choices;
        this.level = level;
        this.timeLimit = timeLimit;
        this.hint=hint;

    }
    ask(prompt) {
        let answer;
        do {
            console.log(this.name);
            console.log(this.taskDescription);
            answer = prompt("Your answer:");
        } while (answer !== this.correctAnswer)
        return true;
    }

}
// export default Riddle;
export { Riddle };
