module.exports = function(sequelize: any, DataTypes: any){

const Teacher = sequelize.define("Teacher", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
        timestamps: false
    })



    Teacher.associate = function(models : any){
    
        Teacher.belongsToMany(models.Student, {
          through: "StudentTeachers"
      })
    
      }

return Teacher

}

    
  


