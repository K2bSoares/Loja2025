import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';
import { Cesta } from '../model/cesta';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css'],
  animations: [
    trigger('fadeInOnScroll', [
      state('hidden', style({ opacity: 0, transform: 'translateY(30px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('600ms ease-out')),
    ])
  ]
})
export class VitrineComponent implements AfterViewInit {
  public lista: Produto[] = [
   {codigo:1, nome:"Perfume Ilía", valor:100, descritivo:"Perfume Natura feminino", quantidade:3, promo:100, destaque:1, keywords:""},
    {codigo:2, nome:"Perfume Clash", valor:150, descritivo:"Perfume Oboticário masculino Eau de Parfum", quantidade:3, promo:100, destaque:1, keywords:""},
    {codigo:3, nome:"Perfume Florata Passion", valor:100, descritivo:"Perfume Oboticário feminino Eau de Parfum", quantidade:4, promo:100, destaque:1, keywords:""},
    {codigo:4, nome:"Perfume Castanha", valor:350, descritivo:"Perfume Natura feminino", quantidade:2, promo:250, destaque:1, keywords:""},
    {codigo:5, nome:"Perfume 214", valor:120, descritivo:"Perfume Oboticário feminino Eau de Parfum", quantidade:5, promo:110, destaque:1, keywords:""},
    {codigo:6, nome:"Perfume Her Code", valor:90, descritivo:"Perfume Oboticário feminino Eau de Parfum", quantidade:6, promo:85, destaque:0, keywords:""},
    {codigo:7, nome:"Perfume Luna Radiante", valor:130, descritivo:"Perfume Natura feminino", quantidade:4, promo:120, destaque:1, keywords:""},
    {codigo:8, nome:"Perfume Clube 6", valor:500, descritivo:"Perfume Eudora masculino", quantidade:2, promo:450, destaque:0, keywords:""},
    {codigo:9, nome:"Perfume Pulse", valor:80, descritivo:"Perfume Eudora masculino", quantidade:5, promo:70, destaque:1, keywords:""},
    {codigo:10, nome:"Perfume Egeo Bomb Black", valor:50, descritivo:"Perfume Oboticário masculino", quantidade:10, promo:45, destaque:0, keywords:""},
    {codigo:11, nome:"Perfume H Acqua", valor:280, descritivo:"Perfume Eudora masculino", quantidade:3, promo:250,destaque:1, keywords:""},
    {codigo:12, nome:"Perfume Uomini Black", valor:95, descritivo:"Perfume Oboticário masculino", quantidade:7, promo:85,destaque:0, keywords:""}
  ];

  public listaFiltrada: Produto[] = [];

  visibilidade: boolean[] = [];

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  constructor() {
    let filtro = localStorage.getItem("filtro");
    if (filtro) {
      this.fazerBusca(filtro);
    }
  }

  ngAfterViewInit(): void {
    const listaExibida = this.listaFiltrada.length > 0 ? this.listaFiltrada : this.lista;
    this.visibilidade = new Array(listaExibida.length).fill(false);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = +entry.target.getAttribute('data-index')!;
          this.visibilidade[index] = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.cardElements.forEach((el, i) => {
      el.nativeElement.setAttribute('data-index', i.toString());
      observer.observe(el.nativeElement);
    });
  }

  fazerBusca(filtro: string) {
    this.listaFiltrada = this.lista.filter(produto =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  verDetalhe(obj: Produto) {
    localStorage.setItem("produto", JSON.stringify(obj));
    location.href = "detalhe";
  }

  adicionar(obj: Produto) {
    let json = localStorage.getItem("cesta");
    let cesta = new Cesta();
    if (json != null) {
      cesta = JSON.parse(json);
    }
    cesta.itens.push(obj);
    cesta.total = cesta.total + obj.valor;
    localStorage.setItem("cesta", JSON.stringify(cesta));
    location.href = "cesta";
  }
}
