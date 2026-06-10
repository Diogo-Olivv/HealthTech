/**
 * Button.test.jsx — Testes automatizados do componente Button
 
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/ui/Button';

// Suprimir o aviso de CSS Modules (não disponível no ambiente Jest)
jest.mock('../../components/ui/Button.module.css', () =>
  new Proxy({}, { get: (_, key) => key })
);

describe('Button — Estado Normal', () => {
  it('renderiza o texto filho corretamente', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('aplica o tipo "button" por padrão', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('aceita type="submit" quando especificado', () => {
    render(<Button type="submit">Salvar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('aceita e passa aria-label para o elemento', () => {
    render(<Button aria-label="Fechar modal">×</Button>);
    expect(screen.getByRole('button', { name: /fechar modal/i })).toBeInTheDocument();
  });

  it('chama onClick ao ser clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renderiza variantes sem erros (primary, secondary, ghost, danger)', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'];
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount();
    });
  });

  it('renderiza tamanhos sem erros (sm, md, lg)', () => {
    const sizes = ['sm', 'md', 'lg'];
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount();
    });
  });
});

describe('Button — Estado Desabilitado', () => {
  it('possui o atributo disabled', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('possui aria-disabled="true"', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('NÃO chama onClick quando desabilitado', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Desabilitado
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Button — Estado Loading', () => {
  it('renderiza o spinner quando loading=true', () => {
    render(<Button loading>Carregando</Button>);
    // O spinner tem role="status" + aria-hidden="true"
    const spinner = document.querySelector('[role="status"]');
    expect(spinner).toBeInTheDocument();
  });

  it('possui aria-busy="true" quando loading', () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('fica desabilitado quando loading (disabled implícito)', () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('NÃO chama onClick quando loading', () => {
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Carregando
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('ainda exibe o texto filho durante loading', () => {
    render(<Button loading>Salvando...</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Salvando...');
  });
});

describe('Button — Loading + Disabled combinados', () => {
  it('permanece desabilitado e com aria-busy quando ambos são true', () => {
    render(
      <Button loading disabled>
        Aguarde
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Button — fullWidth', () => {
  it('renderiza sem erros com fullWidth=true', () => {
    render(<Button fullWidth>Largura total</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('Button — Props extras', () => {
  it('passa atributos data-* para o elemento', () => {
    render(<Button data-testid="meu-botao">OK</Button>);
    expect(screen.getByTestId('meu-botao')).toBeInTheDocument();
  });

  it('aceita className adicional', () => {
    render(<Button className="custom-class">OK</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});
