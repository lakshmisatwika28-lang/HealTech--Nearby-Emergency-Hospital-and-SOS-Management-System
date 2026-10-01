class EmergencyContact {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.phone = data.phone;
    this.relationship = data.relationship;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}

export default EmergencyContact;