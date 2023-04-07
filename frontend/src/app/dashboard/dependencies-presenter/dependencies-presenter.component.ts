import { Component, OnInit } from '@angular/core';
import { DependenciesPresenter } from './dependencies-presenter';

@Component({
  selector: 'app-dependencies-presenter',
  templateUrl: './dependencies-presenter.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DependenciesPresenterComponent implements OnInit {
  dependencyTitle = "";
  dependencyDescription = "";
  dependenciesReason = "";
  choosingTypes = false;

  dependencyTypes: string[] = DependenciesPresenter.dependencyTypes;
  selectedDependencyTypes: string[] = [... this.dependencyTypes];

  toggle() {
    this.choosingTypes = !this.choosingTypes;
  }

  checked(item: string) {
    if (this.selectedDependencyTypes.indexOf(item) != -1) { return true; }
    else { return false; }
  }

  onChange(target: EventTarget | null, item: string) {
    if ((target as any).checked) { this.selectedDependencyTypes.push(item); }
    else { this.selectedDependencyTypes.splice(this.selectedDependencyTypes.indexOf(item), 1); }

    DependenciesPresenter.selectedTypes$.next(this.selectedDependencyTypes);
  }

  constructor() {    
    DependenciesPresenter.selectedTypes$.next(this.selectedDependencyTypes);

    DependenciesPresenter.dependencyTitle$.subscribe(value => {
      this.dependencyTitle = value;
    });

    DependenciesPresenter.dependencyDescription$.subscribe(value => {
      this.dependencyDescription = value;
    });

    DependenciesPresenter.dependencyReason$.subscribe(value => {
      this.dependenciesReason = value;
    });
  }

  ngOnInit(): void { }

  public nextDependency(): void {
    DependenciesPresenter.nextDependency();
  }

  public cancelPresenting(): void {
    DependenciesPresenter.cancelPresenting();
  }
}
