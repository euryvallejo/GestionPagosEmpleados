import React from 'react';
import EmpleadoForm from '../components/EmpleadoForm';

const RegistroEmpleado: React.FC = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col">
                    <h2>Registro de Empleado</h2>
                    <EmpleadoForm />
                </div>
            </div>
        </div>
    );
};

export default RegistroEmpleado;