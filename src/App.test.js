import { render, screen } from '@testing-library/react';
import CamposPerfil from './componentes/usuarios/CamposPerfil';

test('administradores y recepcionistas no necesitan datos de un perfil clínico', () => {
    const { rerender } = render(<CamposPerfil rol="Administrador" datos={{}} onChange={() => {}} />);
    expect(screen.queryByRole('textbox')).toBeNull();
    rerender(<CamposPerfil rol="Recepcionista" datos={{}} onChange={() => {}} />);
    expect(screen.queryByRole('textbox')).toBeNull();
});
