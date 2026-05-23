import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Coche } from '../../../../../../interfaces/coche.interface';
import { Marca } from '../../../../../../interfaces/marca.interface';

type CocheForm = {
  id?: number;
  modelo: string;
  anio: number | null;
  precio: number | null;
  marca_id: number | null;
  descripcion: string;
  potencia: number | null;
  combustible: string;
  transmision: string;
  tipo_carroceria: string;
  color: string;
  num_plazas: number | null;
  num_puertas: number | null;
  disponible: boolean;
  destacado: boolean;
};

@Component({
  selector: 'app-coches-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './coches.html',
  styleUrl: './coches.scss'
})

export class CochesAdmin implements OnChanges {

  @Input() coches: Coche[] = [];
  @Input() marcas: Marca[] = [];
  @Output() actualizar = new EventEmitter<void>();

  filtro: string = 'todos';
  busqueda: string = '';

  // Modal
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  guardando: boolean = false;

  // Modal imágenes (Actualizado con los cambios de Claude)
  modalImagenesAbierto: boolean = false;
  cocheImagenes: Coche | null = null;
  modoImagen: 'archivo' | 'url' = 'archivo';

  // Modo archivo
  archivoSeleccionado: File | null = null;
  previewUrl: string = '';

  // Modo URL
  nuevaImagenUrl: string = '';

  // Compartido
  nuevaImagenPrincipal: boolean = false;
  agregandoImagen: boolean = false;

  // formVacio hace un reset del formulario para crear un nuevo coche o limpiar el modal al cerrar
  form: CocheForm = this.formVacio();

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  // Devuelve un objeto con los valores por defecto para el formulario de coche
  formVacio(): CocheForm {
    return {
      modelo: '', anio: null, precio: null, marca_id: null,
      descripcion: '', potencia: null, combustible: '', transmision: '',
      tipo_carroceria: '', color: '', num_plazas: null, num_puertas: null,
      disponible: true, destacado: false
    };
  }

  get cochesFiltrados(): Coche[] {
    let lista = this.coches;
    if (this.filtro === 'disponibles') lista = lista.filter(coche => coche.disponible);
    if (this.filtro === 'reservados') lista = lista.filter(coche => !coche.disponible);
    if (this.busqueda.trim()) {
      const query = this.busqueda.toLowerCase();
      lista = lista.filter(coche =>
        coche.modelo.toLowerCase().includes(query) ||
        coche.marca?.nombre.toLowerCase().includes(query)
      );
    }
    return lista;
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  abrirEditar(coche: Coche) {
    this.form = {
      id: coche.id,
      modelo: coche.modelo,
      anio: coche.anio,
      precio: coche.precio,
      marca_id: (coche.marca as any)?.id ?? null,
      descripcion: coche.descripcion ?? '',
      potencia: coche.potencia ?? null,
      combustible: coche.combustible ?? '',
      transmision: coche.transmision ?? '',
      tipo_carroceria: coche.tipo_carroceria ?? '',
      color: coche.color ?? '',
      num_plazas: coche.num_plazas ?? null,
      num_puertas: coche.num_puertas ?? null,
      disponible: coche.disponible ?? true,
      destacado: coche.destacado ?? false,
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.modelo || !this.form.marca_id || !this.form.precio || !this.form.anio) {
      this.toastr.warning('Completa los campos obligatorios');
      return;
    }

    this.guardando = true;

    const payload = {
      modelo: this.form.modelo.trim(),
      anio: Number(this.form.anio),
      precio: Number(this.form.precio),
      marca_id: Number(this.form.marca_id),
      descripcion: this.form.descripcion.trim() || undefined,
      potencia: this.form.potencia !== null ? Number(this.form.potencia) : undefined,
      combustible: this.form.combustible || undefined,
      transmision: this.form.transmision || undefined,
      tipo_carroceria: this.form.tipo_carroceria || undefined,
      color: this.form.color || undefined,
      num_plazas: this.form.num_plazas ?? undefined,
      num_puertas: this.form.num_puertas ?? undefined,
      disponible: this.form.disponible,
      destacado: this.form.destacado,
    };

    const observable = this.modoEdicion && this.form.id
      ? this.adminService.updateCoche(this.form.id, payload)
      : this.adminService.createCoche(payload);

    observable.subscribe({
      next: () => {
        this.toastr.success(this.modoEdicion ? 'Vehículo actualizado' : 'Vehículo creado');
        this.cerrarModal();
        this.actualizar.emit();
        this.guardando = false;
      },
      error: () => {
        this.toastr.error('Error al guardar el vehículo');
        this.guardando = false;
      }
    });
  }

  eliminar(coche: Coche) {
    if (!confirm(`¿Eliminar el vehículo "${coche.modelo}"? Esta acción no se puede deshacer.`)) return;

    this.adminService.deleteCoche(coche.id).subscribe({
      next: () => {
        this.toastr.success('Vehículo eliminado');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar el vehículo')
    });
  }

  // ── GESTIÓN DE IMÁGENES (Nuevos métodos sugeridos por Claude) ──
  abrirImagenes(coche: Coche) {
    this.cocheImagenes = coche;
    this.resetFormImagen();
    this.modalImagenesAbierto = true;
  }

  cerrarImagenes() {
    this.modalImagenesAbierto = false;
    this.cocheImagenes = null;
    this.resetFormImagen();
  }

  resetFormImagen() {
    this.modoImagen = 'archivo';
    this.archivoSeleccionado = null;
    this.previewUrl = '';
    this.nuevaImagenUrl = '';
    this.nuevaImagenPrincipal = false;
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.setArchivo(file);
  }

  onDropCoche(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) this.setArchivo(file);
  }

  setArchivo(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('La imagen no puede superar los 5 MB');
      return;
    }
    this.archivoSeleccionado = file;
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  quitarArchivo(event: Event) {
    event.stopPropagation();
    this.archivoSeleccionado = null;
    this.previewUrl = '';
  }

  agregarImagen() {
    if (!this.cocheImagenes) return;

    this.agregandoImagen = true;

    const obs = this.modoImagen === 'archivo'
      ? (() => {
          if (!this.archivoSeleccionado) {
            this.toastr.warning('Selecciona un archivo');
            this.agregandoImagen = false;
            return null;
          }
          return this.adminService.addImagenCocheArchivo(
            this.cocheImagenes!.id,
            this.archivoSeleccionado,
            this.nuevaImagenPrincipal
          );
        })()
      : (() => {
          if (!this.nuevaImagenUrl.trim()) {
            this.toastr.warning('Introduce una URL válida');
            this.agregandoImagen = false;
            return null;
          }
          return this.adminService.addImagenCocheUrl(
            this.cocheImagenes!.id,
            this.nuevaImagenUrl.trim(),
            this.nuevaImagenPrincipal
          );
        })();

    if (!obs) return;

    obs.subscribe({
      next: () => {
        this.toastr.success('Imagen añadida correctamente');
        this.resetFormImagen();
        this.agregandoImagen = false;
        this.actualizar.emit();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Error al subir la imagen';
        this.toastr.error(msg);
        this.agregandoImagen = false;
      }
    });
  }

  eliminarImagen(imagenId: number) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    this.adminService.deleteImagenCoche(imagenId).subscribe({
      next: () => {
        this.toastr.success('Imagen eliminada');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar la imagen')
    });
  }
}