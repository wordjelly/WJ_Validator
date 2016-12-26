class Book
  include Mongoid::Document
  attr_accessor :is_valid
  field :name, type: String
  field :is_valid, type: Boolean

  def check_availability
    a = Book.where(:name => self.name)
    if a.count > 0
      name_unavailable
    else
      name_available
    end
  end

  def name_available
  	self.is_valid = true
  end

  def name_unavailable
  	self.is_valid = false
  end
  
end
