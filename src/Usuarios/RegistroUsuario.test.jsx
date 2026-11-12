import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistroUsuario from './RegistroUsuario';
import api from '../services/api';

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock('../services/api', () => ({ post: jest.fn() }));

const comunes = { nombres: 'Ana', apellidos: 'Pérez', tipoDocumento: 'CC', documento: '1234567', correo: 'ana@example.com', telefono: '3001234567', fechaNacimiento: '1995-04-10', password: 'secreto123', confirmarPassword: 'secreto123' };

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    api.post.mockResolvedValue({ data: { mensaje: 'Creado' } });
});
afterEach(() => jest.restoreAllMocks());

function completar(container, datos) {
    for (const [name, value] of Object.entries(datos)) {
        fireEvent.change(container.querySelector(`[name="${name}"]`), { target: { value } });
    }
}

test('registra un particular con datos comunes y perfil, sin exigir EPS', async () => {
    const { container } = render(<RegistroUsuario />);
    completar(container, { rol: 'Paciente' });
    completar(container, { ...comunes, sexo: 'Femenino', direccion: 'Calle 1' });
    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    expect(api.post).toHaveBeenCalledWith('/users', expect.objectContaining({ rol: 'Paciente', eps: '', sexo: 'Femenino', direccion: 'Calle 1' }));
    expect(api.post.mock.calls[0][1].confirmarPassword).toBeUndefined();
    expect(api.post.mock.calls[0][1].registroProfesional).toBeUndefined();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar' }).disabled).toBe(false));
});

test('registra al médico con especialidades como lista y sin datos de paciente', async () => {
    const { container } = render(<RegistroUsuario />);
    completar(container, { rol: 'Medico' });
    completar(container, { ...comunes, registroProfesional: 'REG-1' });
    fireEvent.click(screen.getByText('Seleccionar especialidades'));
    fireEvent.click(screen.getByLabelText('Medicina general'));
    fireEvent.click(screen.getByLabelText('Pediatría'));
    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    expect(api.post).toHaveBeenCalledWith('/users', expect.objectContaining({ rol: 'Medico', especialidades: ['Medicina general', 'Pediatría'], registroProfesional: 'REG-1' }));
    expect(api.post.mock.calls[0][1].eps).toBeUndefined();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar' }).disabled).toBe(false));
});

test('el registro de pacientes fija el rol y usa la ruta de pacientes con EPS opcional', async () => {
    const { container } = render(<RegistroUsuario registroPaciente />);
    expect(screen.getByRole('heading', { name: 'Registro de paciente' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Administrador' })).toBeNull();

    completar(container, { ...comunes, sexo: 'Femenino', direccion: 'Calle 1' });
    fireEvent.submit(screen.getByRole('button', { name: 'Registrar' }).form);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(
        '/pacientes',
        expect.objectContaining({ rol: 'Paciente', eps: '', direccion: 'Calle 1' })
    ));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar' }).disabled).toBe(false));
});

test('registra el nombre escrito al seleccionar Otra EPS', async () => {
    const { container } = render(<RegistroUsuario registroPaciente />);
    completar(container, { ...comunes, sexo: 'Femenino', direccion: 'Calle 1' });

    const selector = screen.getByLabelText('EPS (opcional)');
    fireEvent.change(selector, { target: { value: screen.getByRole('option', { name: 'Otro...' }).value } });
    fireEvent.change(screen.getByLabelText('Nombre de la EPS'), { target: { value: 'EPS de prueba' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Registrar' }).form);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(
        '/pacientes',
        expect.objectContaining({ eps: 'EPS de prueba' })
    ));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar' }).disabled).toBe(false));
});

test('el registro médico fija el rol y envía especialidades y registro profesional', async () => {
    const { container } = render(<RegistroUsuario registroMedico />);
    expect(screen.getByRole('heading', { name: 'Registro de médico' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Administrador' })).toBeNull();
    completar(container, { ...comunes, registroProfesional: 'RM-123' });
    fireEvent.click(screen.getByText('Seleccionar especialidades'));
    fireEvent.click(screen.getByLabelText('Pediatría'));
    fireEvent.click(screen.getByLabelText('Medicina general'));
    fireEvent.submit(screen.getByRole('button', { name: 'Registrar' }).form);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/medicos', expect.objectContaining({
        rol: 'Medico', especialidades: ['Pediatría', 'Medicina general'], registroProfesional: 'RM-123'
    })));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar' }).disabled).toBe(false));
});
