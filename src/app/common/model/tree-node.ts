export class TreeNode{
  
  showIcon = false;
  expanded = false;
  icon = null;

  constructor(public key, public url, public name){
    console.log(`Creating TreeNode - ${this.key} : ${this.url} : ${this.name}`);
    if(url){
      this.showIcon = true;
      this.icon = this._getIcon();
    }
  }

  public expand(){
    this.expanded = !this.expanded;
    this.icon = this._getIcon();
    console.log(`TreeNode - expanding ${this.key}`);
  }

  private _getIcon(){
    if (this.showIcon === true) {
      if(this.expanded){
        return '- ';
      }
      return '+ ';

    }
    return null;
  }
}
