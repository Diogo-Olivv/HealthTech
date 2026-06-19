import { Arquivo } from '../../entities/arquivo.entity';

/**
 * Forma pública de um Arquivo. Campos sensíveis (caminhoStorage, nomeUnico)
 * são intencionalmente omitidos — nunca devem trafegar para o front-end.
 */
export type ArquivoResponseDto = Omit<Arquivo, 'caminhoStorage' | 'nomeUnico'>;

export function toArquivoResponse(arquivo: Arquivo): ArquivoResponseDto {
  const {
    caminhoStorage: _caminho,
    nomeUnico: _nomeUnico,
    ...publicData
  } = arquivo;
  void _caminho;
  void _nomeUnico;
  return publicData;
}
