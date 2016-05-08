require 'rails_helper'

RSpec.describe "maps/show", type: :view do
  before(:each) do
    @map = assign(:map, Map.create!(
      :schema => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/MyText/)
  end
end
