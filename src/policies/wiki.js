const ApplicationPolicy = require("./application")

module.exports = class WikiPolicy extends ApplicationPolicy {
  new(){
    return this._isStandard() || this._isPremium() || this._isAdmin()
  }

  create(){
    return this.new()
  }

  edit(){
    return this._isStandard() || this._isPremium() || this.isAdmin()
  }

  update(){
    return this.edit()
  }

  destroy(){
    return this.update()
  }
}
