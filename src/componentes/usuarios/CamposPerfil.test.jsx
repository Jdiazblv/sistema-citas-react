import { render, screen } from '@testing-library/react';
import CamposPerfil from './CamposPerfil';

const datos = { sexo: '', direccion: '', eps: '', especialidades: '', registroProfesional: '' };
test('un paciente particular puede registrarse sin EPS', () => {
    render(<CamposPerfil rol="Paciente" datos={datos} onChange={() => {}} />);
    expect(screen.getByLabelText('EPS (opcional)').required).toBe(false);
    expect(screen.getByLabelText('Dirección *').required).toBe(true);
    expect(screen.queryByLabelText('Registro profesional *')).toBeNull();
});
test('el médico requiere datos profesionales y no solicita EPS', () => {
    render(<CamposPerfil rol="Medico" datos={datos} onChange={() => {}} />);
    expect(screen.getByLabelText('Registro profesional *').required).toBe(true);
    expect(screen.queryByLabelText('EPS (opcional)')).toBeNull();
});
