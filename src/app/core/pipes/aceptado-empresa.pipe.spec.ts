import { EstadoRegistroPipe } from './estado-registro.pipe';

describe('AceptadoEmpresaPipe', () => {
    it('create an instance', () => {
        const pipe = new EstadoRegistroPipe();
        expect(pipe).toBeTruthy();
    });
});
