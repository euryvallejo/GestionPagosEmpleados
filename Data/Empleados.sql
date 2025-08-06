INSERT INTO Empleados (
    ApellidoPaterno, FechaIngreso, NumeroSeguroSocial, PrimerNombre, TipoEmpleado,
    SalarioSemanal, SalarioBase, TarifaComision, VentasBrutas,
    EmpleadoPorComision_TarifaComision, EmpleadoPorComision_VentasBrutas,
    HorasTrabajadas, SueldoPorHora
)
VALUES 
('Gómez', '2021-03-15', '123-45-6789', 'Ana', 'Asalariado', 800.00, 0, 0, 0, 0, 0, 0, 0),
('López', '2020-06-10', '987-65-4321', 'Carlos', 'PorHoras', 0, 0, 0, 0, 0, 0, 40, 15.50),
('Martínez', '2022-01-25', '555-66-7777', 'Lucía', 'PorComision', 0, 0, 0.10, 12000.00, 0.10, 12000.00, 0, 0),
('Ramírez', '2019-11-12', '333-22-1111', 'José', 'AsalariadoPorComision', 500.00, 300.00, 0.05, 8000.00, 0, 0, 0, 0),
('Fernández', '2018-07-30', '444-55-6666', 'Elena', 'PorHoras', 0, 0, 0, 0, 0, 0, 35, 18.75),
('Díaz', '2023-04-05', '222-11-3333', 'Miguel', 'PorComision', 0, 0, 0.12, 15000.00, 0.12, 15000.00, 0, 0),
('Torres', '2017-10-21', '777-88-9999', 'Sara', 'Asalariado', 950.00, 0, 0, 0, 0, 0, 0, 0),
('Vargas', '2021-08-18', '666-77-8888', 'Diego', 'AsalariadoPorComision', 600.00, 350.00, 0.07, 9000.00, 0, 0, 0, 0),
('Reyes', '2016-02-14', '111-22-3333', 'Paula', 'PorHoras', 0, 0, 0, 0, 0, 0, 30, 20.00),
('Castillo', '2020-12-03', '999-00-1111', 'Andrés', 'PorComision', 0, 0, 0.15, 20000.00, 0.15, 20000.00, 0, 0);
