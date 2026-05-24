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

  form: MarcaForm = this.formVacio();

  // Archivos seleccionados
  logoFile: File | null = null;
  heroFile: File | null = null;
  logoPreview: string = '';
  heroPreview: string = '';

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
    const q = this.busqueda.toLowerCase();
    return this.marcas.filter(m =>
      m.nombre.toLowerCase().includes(q) || m.pais?.toLowerCase().includes(q)
    );
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.resetArchivos();
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
    this.resetArchivos();
    // Ponemos las URLs actuales como preview
    this.logoPreview = marca.logo ?? '';
    this.heroPreview = marca.imagen_hero ?? '';
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
    this.resetArchivos();
  }

  resetArchivos() {
    this.logoFile = null;
    this.heroFile = null;
    this.logoPreview = '';
    this.heroPreview = '';
  }

  onLogoSeleccionado(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (event) => this.logoPreview = event.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  onHeroSeleccionado(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.heroFile = file;
      const reader = new FileReader();
      reader.onload = (event) => this.heroPreview = event.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (!this.form.nombre.trim()) {
      this.toastr.warning('El nombre de la marca es obligatorio');
      return;
    }
    this.guardando = true;

    // Preparamos el objeto de datos (sin los campos de archivo)
    const data = {
      nombre: this.form.nombre,
      pais: this.form.pais,
      anio_fundacion: this.form.anio_fundacion,
      descripcion: this.form.descripcion,
      slogan: this.form.slogan,
      // Solo mandamos la URL si NO hay archivo nuevo (si hay archivo, el back la sobreescribe)
      ...(!this.logoFile && { logo: this.form.logo }),
      ...(!this.heroFile && { imagen_hero: this.form.imagen_hero }),
    };

    const obs = this.modoEdicion && this.form.id
      ? this.adminService.updateMarca(this.form.id, data, this.logoFile ?? undefined, this.heroFile ?? undefined)
      : this.adminService.createMarca(data, this.logoFile ?? undefined, this.heroFile ?? undefined);

    obs.subscribe({
      next: () => {
        this.toastr.success(this.modoEdicion ? 'Marca actualizada' : 'Marca creada');
        this.cerrarModal();
        this.actualizar.emit();
        this.guardando = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Error al guardar la marca');
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