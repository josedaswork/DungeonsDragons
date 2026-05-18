import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('@/lib/storage', () => ({
  getScriptUrl: vi.fn(() => 'https://script.google.com/test'),
  setScriptUrl: vi.fn(),
  clearCache: vi.fn(),
  getCachedCharacters: vi.fn(() => []),
  listCharacters: vi.fn(() => Promise.resolve([])),
  getCharacter: vi.fn(() => Promise.resolve(null)),
  pingServer: vi.fn(() => Promise.resolve({ success: true })),
  createCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  deleteCharacter: vi.fn(),
}));

import App from '../App';

describe('App', () => {
  it('renders the empty state when connected', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('No hay personaje')).toBeInTheDocument();
    });
  });
});
