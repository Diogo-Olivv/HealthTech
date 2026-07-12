import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilesTable from "../FilesTable";
import type { ArquivoDto } from "@/dto/arquivo.dto";

jest.mock("@/services/arquivos.service");
import * as arquivosService from "@/services/arquivos.service";

const makeArquivo = (overrides: Partial<ArquivoDto> = {}): ArquivoDto => ({
    id: "arquivo-1",
    nomeOriginal: "exame.pdf",
    tipo: "application/pdf",
    tamanho: 2048,
    dataUpload: "2026-06-12T00:00:00Z",
    descricao: null,
    pacienteId: "paciente-1",
    pacienteNome: "Paciente Um",
    medicoUploadId: "medico-1",
    medicoNome: "Dr. Alfa",
    ...overrides,
});

describe("FilesTable — viewerRole=paciente", () => {
    beforeEach(() => jest.clearAllMocks());

    it("renderiza somente o botão de download nas ações", () => {
        render(<FilesTable arquivos={[makeArquivo()]} viewerRole="paciente" />);

        expect(screen.getByLabelText(/baixar exame.pdf/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/editar/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/excluir/i)).not.toBeInTheDocument();
    });

    it("chama getArquivoBlob e dispara download com o nome original", async () => {
        const blob = new Blob(["conteudo"], { type: "application/pdf" });
        const spy = jest.spyOn(arquivosService, "getArquivoBlob").mockResolvedValue(blob);
        const createUrlMock = jest.fn().mockReturnValue("blob:mock-url");
        const revokeUrlMock = jest.fn();
        (URL as unknown as { createObjectURL: typeof createUrlMock }).createObjectURL = createUrlMock;
        (URL as unknown as { revokeObjectURL: typeof revokeUrlMock }).revokeObjectURL = revokeUrlMock;
        const clickSpy = jest
            .spyOn(HTMLAnchorElement.prototype, "click")
            .mockImplementation(() => undefined);

        render(<FilesTable arquivos={[makeArquivo()]} viewerRole="paciente" />);
        fireEvent.click(screen.getByLabelText(/baixar exame.pdf/i));

        await waitFor(() => expect(spy).toHaveBeenCalledWith("arquivo-1"));
        expect(createUrlMock).toHaveBeenCalledWith(blob);
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(revokeUrlMock).toHaveBeenCalledWith("blob:mock-url");
    });

    it("exibe mensagem de erro quando o service falha", async () => {
        jest.spyOn(arquivosService, "getArquivoBlob").mockRejectedValue(
            new Error("Boom!"),
        );

        render(<FilesTable arquivos={[makeArquivo()]} viewerRole="paciente" />);
        fireEvent.click(screen.getByLabelText(/baixar/i));

        expect(await screen.findByRole("alert")).toHaveTextContent(/boom/i);
    });

    it("mostra a descrição sob o nome quando presente", () => {
        render(
            <FilesTable
                arquivos={[makeArquivo({ descricao: "Hemograma completo" })]}
                viewerRole="paciente"
            />,
        );

        expect(screen.getByText("Hemograma completo")).toBeInTheDocument();
    });
});

describe("FilesTable — viewerRole=medico (proprietário)", () => {
    beforeEach(() => jest.clearAllMocks());

    it("mostra botões Editar e Excluir quando o médico logado é o dono do upload", () => {
        render(
            <FilesTable
                arquivos={[makeArquivo({ medicoUploadId: "medico-1" })]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
            />,
        );

        expect(screen.getByLabelText(/editar exame.pdf/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/excluir exame.pdf/i)).toBeInTheDocument();
    });

    it("esconde botões Editar e Excluir se o arquivo foi enviado por outro médico", () => {
        render(
            <FilesTable
                arquivos={[makeArquivo({ medicoUploadId: "outro-medico" })]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
            />,
        );

        expect(screen.getByLabelText(/baixar/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/editar/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/excluir/i)).not.toBeInTheDocument();
    });

    it("abre o modal de confirmação ao clicar em excluir e cancela sem chamar delete", () => {
        const spy = jest.spyOn(arquivosService, "deleteArquivo");

        render(
            <FilesTable
                arquivos={[makeArquivo({ medicoUploadId: "medico-1" })]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
            />,
        );

        fireEvent.click(screen.getByLabelText(/excluir exame.pdf/i));
        expect(screen.getByRole("dialog")).toHaveTextContent(/tem certeza/i);

        fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
        expect(spy).not.toHaveBeenCalled();
    });

    it("confirma exclusão: chama deleteArquivo e onMutation", async () => {
        jest.spyOn(arquivosService, "deleteArquivo").mockResolvedValue(undefined);
        const onMutation = jest.fn();

        render(
            <FilesTable
                arquivos={[makeArquivo({ medicoUploadId: "medico-1" })]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
                onMutation={onMutation}
            />,
        );

        fireEvent.click(screen.getByLabelText(/excluir exame.pdf/i));
        fireEvent.click(screen.getByRole("button", { name: /^excluir$/i }));

        await waitFor(() =>
            expect(arquivosService.deleteArquivo).toHaveBeenCalledWith("arquivo-1"),
        );
        expect(onMutation).toHaveBeenCalledTimes(1);
    });

    it("abre modal de edição preenchido com a descrição atual e salva a nova", async () => {
        jest.spyOn(arquivosService, "atualizarArquivo").mockResolvedValue({
            ...makeArquivo({ descricao: "Nova descrição" }),
        });
        const onMutation = jest.fn();

        render(
            <FilesTable
                arquivos={[
                    makeArquivo({
                        medicoUploadId: "medico-1",
                        descricao: "Descrição antiga",
                    }),
                ]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
                onMutation={onMutation}
            />,
        );

        fireEvent.click(screen.getByLabelText(/editar exame.pdf/i));

        const input = screen.getByLabelText(/descrição do exame/i) as HTMLInputElement;
        expect(input.value).toBe("Descrição antiga");

        fireEvent.change(input, { target: { value: "Nova descrição" } });
        fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

        await waitFor(() =>
            expect(arquivosService.atualizarArquivo).toHaveBeenCalledWith(
                "arquivo-1",
                { descricao: "Nova descrição" },
            ),
        );
        expect(onMutation).toHaveBeenCalled();
    });

    it("mostra mensagem de erro quando o delete falha", async () => {
        jest.spyOn(arquivosService, "deleteArquivo").mockRejectedValue(
            new Error("Storage indisponível"),
        );

        render(
            <FilesTable
                arquivos={[makeArquivo({ medicoUploadId: "medico-1" })]}
                viewerRole="medico"
                medicoLogadoId="medico-1"
            />,
        );

        fireEvent.click(screen.getByLabelText(/excluir/i));
        fireEvent.click(screen.getByRole("button", { name: /^excluir$/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(/storage/i);
    });
});

describe("FilesTable — busca inclui descrição", () => {
    it("filtra arquivos pela descrição digitada", () => {
        render(
            <FilesTable
                arquivos={[
                    makeArquivo({ id: "1", nomeOriginal: "a.pdf", descricao: "Hemograma" }),
                    makeArquivo({ id: "2", nomeOriginal: "b.pdf", descricao: "Raio-X" }),
                ]}
                viewerRole="paciente"
            />,
        );

        fireEvent.change(screen.getByLabelText(/pesquisar arquivos/i), {
            target: { value: "hemograma" },
        });

        expect(screen.getByText("Hemograma")).toBeInTheDocument();
        expect(screen.queryByText("Raio-X")).not.toBeInTheDocument();
    });
});
