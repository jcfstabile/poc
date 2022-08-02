class Personaje
  include MGame
  def initialize(imageName, posicion)
    super
    @posicion = posicion
    @imageName = imageName
  end

  # def draw
  #   # $gw.rect(@color, @posicion.x, @posicion.y, 10, 10)
  #   Game.draw(self)
  # end
  def color
    @color
  end
  def posicion
    @posicion
  end
  def left
    @posicion.izquierda
  end
  def right
    @posicion.derecha
  end
  def up
    @posicion.arriba
  end
  def down
    @posicion.abajo
  end
  def imageName
    @imageName
  end

end


a = Personaje.new('RickFront.png', Posicion.new(10,10))
# b = Personaje.new('lightblue', Posicion.new(100,100))

