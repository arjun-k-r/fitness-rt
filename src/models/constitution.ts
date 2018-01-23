export class MentalConstitution {
  constructor(
    public temperament: boolean = false,
    public social: boolean = false,
    public negativeTraits: boolean = false,
    public underStress: boolean = false,
    public talk: boolean = false,
    public memory: boolean = false,
    public learningType: boolean = false,
    public dreams: boolean = false,
    public love: boolean = false,
    public creativity: boolean = false,
    public decisions: boolean = false,
    public interests: boolean = false,
    public finances: boolean = false,
    public activity: boolean = false,
    public sexDrive: boolean = false,
    public beliefs: boolean = false,
    public lifetyl: boolean = false
  ) {}
}

export class PhysicalConstitution {
  constructor(
    public frame: boolean = false,
    public weight: boolean = false,
    public appetite: boolean = false,
    public foodamount: boolean = false,
    public skinTexture: boolean = false,
    public complexion: boolean = false,
    public hair: boolean = false,
    public eyes: boolean = false,
    public lips: boolean = false,
    public teeth: boolean = false,
    public fingersNails: boolean = false,
    public voice: boolean = false,
    public bodyTemperature: boolean = false,
    public perspiration: boolean = false,
    public sleep: boolean = false,
    public walk: boolean = false,
    public weather: boolean = false
  ) {}
}

export class Constitution {
  constructor(
    public body: PhysicalConstitution = new PhysicalConstitution(),
    public mind: MentalConstitution = new MentalConstitution()
  ) {}
}