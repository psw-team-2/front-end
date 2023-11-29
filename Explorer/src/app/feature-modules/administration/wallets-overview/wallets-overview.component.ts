import { Component, OnInit } from '@angular/core';
import { Wallet } from '../model/wallet.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-wallets-overview',
  templateUrl: './wallets-overview.component.html',
  styleUrls: ['./wallets-overview.component.css']
})
export class WalletsOverviewComponent implements OnInit {
  wallets: Wallet[] = [];
  selectedWallet: Wallet;
  shouldRenderAddACForm: boolean = false;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getWallets();
  }

  getWallets(): void {
    this.service.getAllWallets().subscribe({
      next: (result: PagedResults<Wallet>) => {
        console.log(result);
        this.wallets = result.results;
      },
      error: () => {
        console.error();
      }
    });
  }

  onAddClicked(wallet: Wallet): void {
    this.selectedWallet = wallet;
    this.shouldRenderAddACForm = !this.shouldRenderAddACForm;
  }

  
  onCloseClicked(): void {
    this.shouldRenderAddACForm = !this.shouldRenderAddACForm;
  }

}
