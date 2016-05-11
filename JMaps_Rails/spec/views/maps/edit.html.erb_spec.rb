require 'rails_helper'

RSpec.describe "maps/edit", type: :view do
  before(:each) do
    @map = assign(:map, Map.create!(
      :schema => "MyText"
    ))
  end

  it "renders the edit map form" do
    render

    assert_select "form[action=?][method=?]", map_path(@map), "post" do

      assert_select "textarea#map_schema[name=?]", "map[schema]"
    end
  end
end
