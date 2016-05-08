require 'rails_helper'

RSpec.describe "maps/new", type: :view do
  before(:each) do
    assign(:map, Map.new(
      :schema => "MyText"
    ))
  end

  it "renders new map form" do
    render

    assert_select "form[action=?][method=?]", maps_path, "post" do

      assert_select "textarea#map_schema[name=?]", "map[schema]"
    end
  end
end
