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

  // Modal imágenes
  modalImagenesAbierto: boolean = false;
  cocheImagenes: Coche | null = null;
  nuevaImagenUrl: string = '';
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

  // ── GESTIÓN DE IMÁGENES ──
  abrirImagenes(coche: Coche) {
    this.cocheImagenes = coche;
    this.nuevaImagenUrl = '';
    this.modalImagenesAbierto = true;
  }

  cerrarImagenes() {
    this.modalImagenesAbierto = false;
    this.cocheImagenes = null;
  }

  agregarImagen(esPrincipal: boolean) {
    if (!this.nuevaImagenUrl.trim() || !this.cocheImagenes) {
      this.toastr.warning('Introduce una URL válida');
      return;
    }
    this.agregandoImagen = true;
    this.adminService.addImagenCoche(this.cocheImagenes.id, this.nuevaImagenUrl.trim(), esPrincipal)
      .subscribe({
        next: () => {
          this.toastr.success('Imagen añadida correctamente');
          this.nuevaImagenUrl = '';
          this.agregandoImagen = false;
          // emit() sirve para enviar un evento al componente padre, en este caso para 
          // que el AdminDashboard vuelva a cargar los datos y así mostrar la nueva imagen 
          // en el listado de coches y en el modal de imágenes
          this.actualizar.emit();
          // Actualizamos la referencia local para reflejar las imágenes en el modal
          const updated = this.coches.find(coche => coche.id === this.cocheImagenes?.id);
          if (updated) this.cocheImagenes = updated;
        },
        error: () => {
          this.toastr.error('Error al añadir la imagen');
          this.agregandoImagen = false;
        }
      });
  }
}