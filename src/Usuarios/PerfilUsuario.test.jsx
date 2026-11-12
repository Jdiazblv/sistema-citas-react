import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PerfilUsuario from './PerfilUsuario';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

jest.mock('react-router-dom', () => ({ useParams: () => ({ id: 'cuenta-1' }), useNavigate: () => jest.fn() }), { virtual: true });
jest.mock('../services/api', () => ({ get: jest.fn(), put: jest.fn(), delete: jest.fn() }));

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));

const cuenta = {
    _id: 'cuenta-1', nombres: 'Ana', apellidos: 'Pérez', tipoDocumento: 'CC',
    documento: '1234567', telefono: '3001234567', correo: 'ana@example.com',
    fechaNacimiento: '1995-04-10', rol: 'Paciente', activo: true
};
beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ usuario: { rol: 'Recepcionista' } });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    api.get.mockResolvedValue({ data: { ...cuenta } });
    api.put.mockResolvedValue({ data: { usuario: { ...cuenta }, mensaje: 'Actualizado' } });
});
afterEach(() => jest.restoreAllMocks());

async function abrirEdicion() {
    const view = render(<PerfilUsuario />);
    fireEvent.click(await screen.findByRole('button', { name: 'Editar datos' }));
    return view;
}

test('valida todos los campos al escribir y permite guardar después de corregirlos', async () => {
    await abrirEdicion();
    const casos = [
        ['Nombres *', '   ', cuenta.nombres, 'Ingrese sus nombres.'],
        ['Apellidos *', '   ', cuenta.apellidos, 'Ingrese sus apellidos.'],
        ['Tipo de documento *', '', cuenta.tipoDocumento, 'Seleccione su tipo de documento.'],
        ['Número de documento *', 'abc', cuenta.documento, 'El documento debe contener solo números.'],
        ['Teléfono *', '123', cuenta.telefono, 'Ingrese un teléfono de al menos 10 dígitos, solo números.'],
        ['Correo electrónico *', 'correo', cuenta.correo, 'Ingrese un correo electrónico válido.'],
        ['Fecha de nacimiento *', '2999-01-01', cuenta.fechaNacimiento, 'La fecha de nacimiento no puede ser futura.']
    ];
    for (const [etiqueta, invalido, valido, mensaje] of casos) {
        const campo = screen.getByLabelText(etiqueta);
        fireEvent.change(campo, { target: { value: invalido } });
        expect(screen.getByText(mensaje)).toBeTruthy();
        expect(campo.getAttribute('aria-invalid')).toBe('true');
        expect(screen.getByRole('button', { name: 'Guardar cambios' }).disabled).toBe(true);
        fireEvent.change(campo, { target: { value: valido } });
        expect(screen.queryByText(mensaje)).toBeNull();
    }
    fireEvent.submit(screen.getByRole('form', { name: 'Editar datos del usuario' }));
    await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));
    expect(api.put.mock.calls[0][1].activo).toBeUndefined();
    expect(api.put.mock.calls[0][1].rol).toBeUndefined();
    await screen.findByRole('button', { name: 'Editar datos' });
});

test('al guardar comprueba también campos inválidos que no fueron modificados', async () => {
    api.get.mockResolvedValue({ data: { ...cuenta, nombres: '  ', fechaNacimiento: '' } });
    await abrirEdicion();
    fireEvent.submit(screen.getByRole('form', { name: 'Editar datos del usuario' }));
    expect(screen.getByText('Ingrese sus nombres.')).toBeTruthy();
    expect(screen.getByText('Seleccione su fecha de nacimiento.')).toBeTruthy();
    expect(api.put).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nombres *')).toHaveFocus();
});

test('el error del servidor conserva el formulario y los datos escritos', async () => {
    api.put.mockRejectedValue({ response: { data: { mensaje: 'Ya existe un registro con ese valor de correo.' } } });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await abrirEdicion();
    fireEvent.change(screen.getByLabelText('Correo electrónico *'), { target: { value: 'otra@example.com' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Editar datos del usuario' }));
    expect((await screen.findByRole('alert')).textContent).toContain('correo');
    expect(screen.getByLabelText('Correo electrónico *').value).toBe('otra@example.com');
    expect(screen.getByRole('button', { name: 'Guardar cambios' }).disabled).toBe(false);
});

test('cancelar descarta los errores y recupera los datos guardados', async () => {
    await abrirEdicion();
    fireEvent.change(screen.getByLabelText('Nombres *'), { target: { value: ' ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Editar datos' }));
    expect(screen.getByLabelText('Nombres *').value).toBe(cuenta.nombres);
    expect(screen.queryByText('Ingrese sus nombres.')).toBeNull();
    expect(api.put).not.toHaveBeenCalled();
});

test('consulta y edita el perfil del paciente con datos de su cuenta y EPS opcional', async () => {
    const paciente = { _id: 'paciente-1', usuarioId: cuenta, sexo: 'Femenino', direccion: 'Calle 1', eps: '' };
    api.get.mockResolvedValue({ data: paciente });
    api.put.mockResolvedValue({ data: { usuario: cuenta, paciente: { ...paciente, direccion: 'Calle 2' } } });

    render(<PerfilUsuario perfilPaciente />);
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Sin EPS registrada')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Eliminar cuenta' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Editar datos' }));
    const direccion = screen.getByLabelText('Dirección *');
    fireEvent.change(direccion, { target: { value: '' } });
    expect(screen.getByText('Ingrese la dirección.')).toBeInTheDocument();
    fireEvent.change(direccion, { target: { value: 'Calle 2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Calle 2')).toBeInTheDocument();
    expect(api.put).toHaveBeenCalledWith('/pacientes/cuenta-1', expect.objectContaining({
        nombres: 'Ana', sexo: 'Femenino', direccion: 'Calle 2', eps: ''
    }));
});

test('el administrador puede cambiar el acceso del paciente y solicitar su eliminación con contraseña', async () => {
    useAuth.mockReturnValue({ usuario: { rol: 'Administrador' } });
    const cuentaPaciente = { ...cuenta, _id: 'usuario-vinculado' };
    api.get.mockResolvedValue({ data: { usuarioId: cuentaPaciente, direccion: 'Calle 1', sexo: 'Femenino' } });
    api.put.mockResolvedValue({ data: { usuario: { ...cuentaPaciente, activo: false } } });
    api.delete.mockRejectedValue({ response: { data: { mensaje: 'La cuenta tiene citas relacionadas.' } } });
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<PerfilUsuario perfilPaciente />);
    fireEvent.click(await screen.findByRole('button', { name: 'Desactivar cuenta' }));
    await screen.findByRole('button', { name: 'Activar cuenta' });
    expect(api.put).toHaveBeenCalledWith('/users/usuario-vinculado', { activo: false });
    expect(screen.getByText('Calle 1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar cuenta' }));
    fireEvent.change(screen.getByLabelText(/Tu contraseña de administrador/), {
        target: { value: 'clave-de-prueba' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar definitivamente' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La cuenta tiene citas relacionadas.');
    expect(api.delete).toHaveBeenCalledWith('/pacientes/cuenta-1', {
        data: { password: 'clave-de-prueba' }
    });
});

test('el médico se consulta y edita con sus datos profesionales', async () => {
    useAuth.mockReturnValue({ usuario: { rol: 'Administrador' } });
    const usuario = { ...cuenta, rol: 'Medico', _id: 'usuario-medico' };
    const medico = {
        usuarioId: usuario, especialidades: ['Medicina general'], registroProfesional: 'RM-123'
    };
    api.get.mockResolvedValue({ data: medico });
    api.put.mockResolvedValue({
        data: { usuario, medico: { ...medico, especialidades: ['Pediatría', 'Medicina general'] } }
    });

    render(<PerfilUsuario perfilMedico />);
    expect(await screen.findByText('Medicina general')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/medicos/cuenta-1');
    fireEvent.click(screen.getByRole('button', { name: 'Editar datos' }));
    fireEvent.change(screen.getByLabelText('Especialidades *'), {
        target: { value: 'Pediatría, Medicina general' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Pediatría, Medicina general')).toBeInTheDocument();
    expect(api.put).toHaveBeenCalledWith('/medicos/cuenta-1', expect.objectContaining({
        especialidades: ['Pediatría', 'Medicina general'], registroProfesional: 'RM-123'
    }));
});

test('recepción puede consultar el perfil médico sin controles de edición ni de cuenta', async () => {
    api.get.mockResolvedValue({
        data: { usuarioId: { ...cuenta, rol: 'Medico' }, especialidades: ['Pediatría'], registroProfesional: 'RM-123' }
    });

    render(<PerfilUsuario perfilMedico />);
    expect(await screen.findByText('Pediatría')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar datos' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Desactivar cuenta' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Eliminar cuenta' })).toBeNull();
});
