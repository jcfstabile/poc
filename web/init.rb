class Game
  def self.subscribe(obj)
    $gw.subscribe(obj)
    $gw.controlRight(obj)
  end

  def self.draw(obj)
    $gw.rect(obj.color, obj.posicion.x, obj.posicion.y, 10, 10)
  end

  def self.drawImage(obj)
    $gw.drawImage(obj.imageName, obj.posicion.x, obj.posicion.y)
  end

end

module MGame
    def initialize
      Game.subscribe(self)
      @color = 'aquamarina'
    end

    def draw
        Game.draw(self)
    end

    def drawImage
      Game.drawImage(self)
    end

    def init
      MGame::initialize
    end
end

class Posicion
  def initialize(x,y)
    @x = x
    @y = y
  end
  def x
      @x
  end
  def y
      @y
  end
  def izquierda
    @x-=1
  end
  def derecha
    @x+=1
  end
  def arriba
    @y-=1
  end
  def abajo
    @y+=1
  end
end
