module.exports = function (sequelize: any, DataTypes: any) {
  const Student = sequelize.define("Student", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  Student.associate = function (models: any) {

    Student.belongsToMany(models.Teacher, {
      through: "StudentTeachers",
    })

  }

  return Student

}