import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleTranslate',
    standalone: true
})
export class RoleTranslatePipe implements PipeTransform {
    transform(role: string | null | undefined): string {
        if (!role) return '';

        const roleMap: { [key: string]: string } = {
            'ADMIN': 'ADMINISTRADOR',
            'USER': 'USUARIO',
            'LIDER': 'LÍDER'
        };

        return roleMap[role.toUpperCase()] || role;
    }
}
