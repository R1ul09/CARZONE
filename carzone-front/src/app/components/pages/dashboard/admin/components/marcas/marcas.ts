import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Marca } from '../../../../../../interfaces/marca.interface';

type MarcaForm = {
  id?: number;
  nombre: string;
  pais: string;
  anio_fundacion: number | null;
  descripcion: string;
  slogan: string;
  logo: string;
  imagen_hero: string;
};

@Component({
  selector: 'app-marcas-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './marcas.html',
  styleUrl: './marcas.scss'
})
export class MarcasAdmin implements OnChanges {

  @Input() marcas: Marca[] = [];
  @Output() actualizar = new EventEmitter<void>();

  busqueda: string = '';
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  guardando: boolean = false;

  // formVacio hace un reset del formulario para crear una nueva marca o limpiar el modal al cerrar
  form: MarcaForm = this.formVacio();

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  formVacio(): MarcaForm {
    return { nombre: '', pais: '', anio_fundacion: null, descripcion: '', slogan: '', logo: '', imagen_hero: '' };
  }

  get marcasFiltradas(): Marca[] {
    if (!this.busqueda.trim()) return this.marcas;
    const query = this.busqueda.toLowerCase();
    return this.marcas.filter(marca => marca.nombre.toLowerCase().includes(query) || marca.pais?.toLowerCase().includes(query));
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  abrirEditar(marca: Marca) {
    this.form = {
      id: marca.id,
      nombre: marca.nombre,
      pais: marca.pais ?? '',
      anio_fundacion: marca.anio_fundacion ?? null,
      descripcion: marca.descripcion ?? '',
      slogan: marca.slogan ?? '',
      logo: marca.logo ?? '',
      imagen_hero: marca.imagen_hero ?? '',
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.nombre.trim()) {
      this.toastr.warning('El nombre de la marca es obligatorio');
      return;
    }
    this.guardando = true;

    const payload = {
      nombre: this.form.nombre.trim(),
      pais: this.form.pais.trim() || undefined,
      anio_fundacion: this.form.anio_fundacion ?? undefined,
      descripcion: this.form.descripcion.trim() || undefined,
      slogan: this.form.slogan.trim() || undefined,
      logo: this.form.logo.trim() || undefined,
      imagen_hero: this.form.imagen_hero.trim() || undefined,
    };

    const observable = this.modoEdicion && this.form.id
      ? this.adminService.updateMarca(this.form.id, payload)
      : this.adminService.createMarca(payload);

    observable.subscribe({
      next: () => {
        this.toastr.success(this.modoEdicion ? 'Marca actualizada' : 'Marca creada');
        this.cerrarModal();
        this.actualizar.emit();
        this.guardando = false;
      },
      error: () => {
        this.toastr.error('Error al guardar la marca');
        this.guardando = false;
      }
    });
  }

  eliminar(marca: Marca) {
    if (!confirm(`¿Eliminar la marca "${marca.nombre}"? Se eliminarán también sus coches asociados.`)) return;

    this.adminService.deleteMarca(marca.id).subscribe({
      next: () => {
        this.toastr.success('Marca eliminada');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar la marca')
    });
  }
}