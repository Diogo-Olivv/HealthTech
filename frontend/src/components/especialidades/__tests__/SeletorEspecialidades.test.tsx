import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SeletorEspecialidades from "../SeletorEspecialidades";

const OPCOES = [
    { id: "1", nome: "Cardiologia", slug: "cardiologia" },
    { id: "2", nome: "Clínica médica", slug: "clinica-medica" },
    { id: "3", nome: "Dermatologia", slug: "dermatologia" },
    { id: "4", nome: "Neurologia", slug: "neurologia" },
];

function Wrapper({ initial = [] as string[], max = 5 }: { initial?: string[]; max?: number }) {
    const [valor, setValor] = useState<string[]>(initial);
    return (
        <SeletorEspecialidades
            valor={valor}
            onChange={setValor}
            opcoes={OPCOES}
            max={max}
        />
    );
}

describe("SeletorEspecialidades", () => {
    it("renderiza chips das especialidades iniciais", () => {
        render(<Wrapper initial={["1"]} />);
        expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    });

    it("abre o dropdown ao focar e adiciona uma opção clicando", () => {
        render(<Wrapper />);
        const input = screen.getByRole("combobox");
        fireEvent.focus(input);

        fireEvent.click(screen.getByRole("option", { name: /clínica médica/i }));

        expect(screen.getByText("Clínica médica")).toBeInTheDocument();
        expect(
            screen.queryByRole("option", { name: /clínica médica/i }),
        ).not.toBeInTheDocument();
    });

    it("filtra opções pelo texto digitado", () => {
        render(<Wrapper />);
        fireEvent.focus(screen.getByRole("combobox"));
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "cardio" } });

        expect(screen.getByRole("option", { name: /cardiologia/i })).toBeInTheDocument();
        expect(
            screen.queryByRole("option", { name: /clínica médica/i }),
        ).not.toBeInTheDocument();
    });

    it("Enter adiciona a primeira opção filtrada", () => {
        render(<Wrapper />);
        const input = screen.getByRole("combobox");
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: "derma" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(screen.getByText("Dermatologia")).toBeInTheDocument();
    });

    it("Backspace remove a última chip quando o input está vazio", () => {
        render(<Wrapper initial={["1", "2"]} />);
        const input = screen.getByRole("combobox");
        fireEvent.focus(input);

        fireEvent.keyDown(input, { key: "Backspace" });

        expect(screen.queryByLabelText(/remover clínica médica/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/remover cardiologia/i)).toBeInTheDocument();
    });

    it("botão X do chip remove aquela especialidade", () => {
        render(<Wrapper initial={["1"]} />);

        fireEvent.click(screen.getByLabelText(/remover cardiologia/i));

        expect(screen.queryByLabelText(/remover cardiologia/i)).not.toBeInTheDocument();
    });

    it("respeita o limite máximo", () => {
        render(<Wrapper initial={["1", "2"]} max={2} />);
        fireEvent.focus(screen.getByRole("combobox"));

        expect(screen.getByRole("combobox")).toBeDisabled();
        expect(screen.getByPlaceholderText(/máximo de 2 atingido/i)).toBeInTheDocument();
    });

    it("mostra o contador atualizado", () => {
        render(<Wrapper initial={["1", "2"]} />);
        expect(screen.getByText(/2\/5 selecionadas/i)).toBeInTheDocument();
    });
});
