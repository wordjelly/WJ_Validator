class Book
  include Mongoid::Document
  attr_accessor :is_valid
  field :name, type: String


  private

  def check_availability
  	(Book.where(:name => self.name).count > 0) ? name_available : name_unavailable
  end

  def name_available
  	self.is_valid = true
  end

  def name_unavailable
  	self.is_valid = false
  end



end
