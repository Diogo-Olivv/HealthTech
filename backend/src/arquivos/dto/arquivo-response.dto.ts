import { Arquivo } from '../../entities/arquivo.entity';

/**
 * Forma pública de um Arquivo — campo caminhoStorage OMITIDO intencionalmente.
 * Este tipo é a única representação que deve trafegar para o front-end.
 */
export type ArquivoResponseDto = Omit<Arquivo, 'caminhoStorage'>;

/**
 * Mapeia a entidade Arquivo para ArquivoResponseDto, garantindo que o campo
 * sensível 'caminhoStorage' nunca seja incluído na resposta.
 */
export function toArquivoResponse(arquivo: Arquivo): ArquivoResponseDto {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    caminhoStorage: _omitted,
    ...publicData
  } = arquivo;

  return publicData;
}
