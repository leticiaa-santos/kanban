import { describe, it, expect } from "vitest";


//describe = como eu descrevo esse teste
describe("Matemática Básica ", () => {

    //qual cenário de teste será executado
    it("Soma 2 + 2", () => {

        //o que é esperado na resposta
        expect(2 + 2).toBe(4)
    });
});